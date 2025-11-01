using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using AutoMapper.QueryableExtensions;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;


namespace Api.Controllers
{
    [ApiController]
    [Route("api/novels")]
    public class NovelController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;

        public NovelController(IWebHostEnvironment env, AppDbContext db, IMapper mapper,INovelStatsService statsService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NovelReadDto>>> GetNovels()
        {
            var novels = await _db.Novels
                .Include(n => n.User)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .ToListAsync();


            var novelDtos = _mapper.Map<List<NovelReadDto>>(novels);

            var ids = novelDtos.Select(n => n.Id).ToList();
            var statsDict = await _statsService.GetStatsForNovelsAsync(ids);

            foreach (var dto in novelDtos)
                if (statsDict.TryGetValue(dto.Id, out var stats))
                    dto.Stats = stats;

            return Ok(novelDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NovelReadDto>> GetNovel(int id)
        {
            var novel = await _db.Novels
                .Include(n => n.User)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (novel == null)
                return NotFound("Novel not found");

            var novelDto = _mapper.Map<NovelReadDto>(novel);

            var stats = await _statsService.GetNovelStatsAsync(id);

            novelDto.Stats = stats;

            return Ok(novelDto);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<NovelReadDto>> CreateNovel([FromBody] CreateNovelDto novelDto)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            if (!Enum.IsDefined(typeof(NovelStatus), novelDto.Status))
                return BadRequest(new { message = $"Invalid novel status: {novelDto.Status}" });

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return BadRequest($"User with id {userId} does not exist.");

            var novel = _mapper.Map<Novel>(novelDto);
            novel.UserId = (int)userId;
            novel.CreatedAt = DateTime.UtcNow;

            _db.Novels.Add(novel);
            await _db.SaveChangesAsync();

            if (novelDto.Tags != null && novelDto.Tags.Any())
            {
                var tagIds = novelDto.Tags.Select(t => t.Id).ToList();
                var existingTags = await _db.Tags
                    .Where(t => tagIds.Contains(t.Id))
                    .ToListAsync();

                foreach (var tag in existingTags)
                {
                    _db.NovelTags.Add(new NovelTag
                    {
                        NovelId = novel.Id,
                        TagId = tag.Id
                    });
                }

                await _db.SaveChangesAsync();
            }

            // Relate the temp image with created novel, and move it to uploads folder
            if (novelDto.CoverImageId.HasValue)
            {
                var temp = await _db.UploadedFiles.FindAsync(novelDto.CoverImageId.Value);
                if (temp != null && temp.UserId == userId && temp.IsTemporary)
                {
                    // Move file from temp dir to permanent
                    var permDir = Path.Combine(_env.WebRootPath, "uploads", "covers", novel.UserId.ToString());
                    if (!Directory.Exists(permDir)) Directory.CreateDirectory(permDir);
                    var newPath = Path.Combine(permDir, temp.FileName);
                    System.IO.File.Move(temp.FilePath, newPath);

                    var newUrl = $"{Request.Scheme}://{Request.Host}/uploads/covers/{novel.UserId}/{temp.FileName}";

                    // Update record
                    temp.FilePath = newPath;
                    temp.FileUrl = newUrl;
                    temp.IsTemporary = false;
                    temp.NovelId = novel.Id;
                    temp.ExpiresAt = null;

                    // set novel cover url
                    novel.CoverImageUrl = newUrl;
                    await _db.SaveChangesAsync();
                }
            }

            var novelReadDto = _mapper.Map<NovelReadDto>(novel);

            return CreatedAtAction(nameof(GetNovel), new { id = novel.Id }, novelReadDto);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<NovelReadDto>> UpdateNovel(int id, [FromBody] UpdateNovelDto novelDto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var novel = await _db.Novels
                .Include(n => n.NovelTags)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (novel == null)
                return NotFound(new { message = "Novel not found." });

            if (novel.UserId != userId)
                return Forbid("Only the author can update this novel.");

            if (novelDto.Status != null && !Enum.IsDefined(typeof(NovelStatus), novelDto.Status))
                return BadRequest(new { message = $"Invalid novel status: {novelDto.Status}" });

            _mapper.Map(novelDto, novel);
            novel.UpdatedAt = DateTime.UtcNow;

            if (novelDto.Tags != null)
            {
                var existingTags = _db.NovelTags.Where(nt => nt.NovelId == novel.Id);
                _db.NovelTags.RemoveRange(existingTags);

                if (novelDto.Tags.Any())
                {
                    var tagIds = novelDto.Tags.Select(t => t.Id).ToList();
                    var validTags = await _db.Tags.Where(t => tagIds.Contains(t.Id)).ToListAsync();

                    foreach (var tag in validTags)
                    {
                        _db.NovelTags.Add(new NovelTag
                        {
                            NovelId = novel.Id,
                            TagId = tag.Id
                        });
                    }
                }
            }

            if (novelDto.CoverImageId.HasValue)
                await ReplaceNovelCoverAsync(novel, novelDto.CoverImageId.Value, userId.Value);

            await _db.SaveChangesAsync();

            var novelReadDto = _mapper.Map<NovelReadDto>(novel);
            return Ok(novelReadDto);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNovel(int id)
        {
            var novel = await _db.Novels.FindAsync(id);

            if (novel == null)
                return NotFound();

            _db.Novels.Remove(novel);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{novelId}/tags/{tagId`}")]
        public async Task<IActionResult> AddTagToNovel(int novelId, int tagId)
        {
            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null) return NotFound();

            var tag = await _db.Tags.FindAsync(tagId);
            if (novel == null) return NotFound();

            if (!await _db.NovelTags.AnyAsync(nt => nt.NovelId == novelId && nt.TagId == tagId))
            {
                _db.NovelTags.Add(new NovelTag { NovelId = novelId, TagId = tagId });
                await _db.SaveChangesAsync();
            }

            return NoContent();
        }

        [HttpDelete("{novelId}/tags/{tagId}")]
        public async Task<IActionResult> RemoveTagFromNovel(int novelId, int tagId)
        {
            var novelTag = await _db.NovelTags.FirstOrDefaultAsync(nt => nt.NovelId == novelId && nt.TagId == tagId);
            if (novelTag == null) return NotFound();

            _db.NovelTags.Remove(novelTag);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<NovelReadDto>>> GetUserNovels(int id)
        {
            var novels = await _db.Novels
                .Where(n => n.UserId == id)
                .Include(n => n.User)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .ToListAsync();


            var novelDtos = _mapper.Map<List<NovelReadDto>>(novels);

            var ids = novelDtos.Select(n => n.Id).ToList();
            var statsDict = await _statsService.GetStatsForNovelsAsync(ids);

            foreach (var dto in novelDtos)
                if (statsDict.TryGetValue(dto.Id, out var stats))
                    dto.Stats = stats;

            return Ok(novelDtos);
        }

        [HttpGet("user/{id}/follows")]
        public async Task<ActionResult<IEnumerable<NovelFollowDto>>> GetUserFollowedNovels(int id)
        {
            var userExists = await _db.Users.AnyAsync(u => u.Id == id);
            if (!userExists)
                return NotFound(new { message = "User not found." });

            var follows = await _db.Follows
                .Where(f => f.UserId == id)
                .Include(f => f.Novel)
                    .ThenInclude(n => n.User)
                .ToListAsync();

            var novelIds = follows.Select(f => f.NovelId).ToList();

            var chapters = await _db.Chapters
                .Where(c => novelIds.Contains(c.NovelId))
                .ToListAsync();

            var novelDtos = follows
                .Select(f =>
                {
                    var novel = f.Novel;
                    var dto = new NovelFollowDto
                    {
                        Id = novel.Id,
                        Title = novel.Title,
                        CoverImageUrl = novel.CoverImageUrl,
                        CreatedAt = novel.CreatedAt,
                        UpdatedAt = novel.UpdatedAt,
                        Status = novel.Status,
                        Author = new UserSummaryDto
                        {
                            Id = novel.User.Id,
                            UserName = novel.User.UserName,
                            AvatarUrl = novel.User.AvatarUrl
                        }
                    };

                    var novelChapters = chapters.Where(c => c.NovelId == novel.Id);
                    var latestChapter = novelChapters.OrderByDescending(c => c.ChapterNumber).FirstOrDefault();

                    var lastReadChapter = f.LastReadChapterId.HasValue
                        ? novelChapters.FirstOrDefault(c => c.Id == f.LastReadChapterId.Value)
                        : null;

                    var nextChapter = f.LastReadChapterId.HasValue
                        ? novelChapters
                            .Where(c => c.ChapterNumber >= lastReadChapter!.ChapterNumber)
                            .OrderBy(c => c.ChapterNumber)
                            .FirstOrDefault()
                        : novelChapters.OrderBy(c => c.ChapterNumber).FirstOrDefault();

                    dto.LatestChapter = latestChapter != null ? new ChapterListItemDto
                    {
                        Id = latestChapter.Id,
                        Title = latestChapter.Title,
                        ChapterNumber = latestChapter.ChapterNumber

                    } : null;
                    dto.LastReadChapter = lastReadChapter != null ? new ChapterListItemDto
                    {
                        Id = lastReadChapter.Id,
                        Title = lastReadChapter.Title,
                        ChapterNumber = lastReadChapter.ChapterNumber

                    } : null;
                    dto.NextChapter = nextChapter != null ? new ChapterListItemDto
                    {
                        Id = nextChapter.Id,
                        Title = nextChapter.Title,
                        ChapterNumber = nextChapter.ChapterNumber

                    } : null;

                    return dto;
                })
                .ToList();

            return Ok(novelDtos);
        }

        [HttpGet("user/{id}/favorites")]
        public async Task<ActionResult<IEnumerable<NovelReadDto>>> GetUserFavoriteNovels(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var favorites = await _db.Favorites
               .Where(f => f.UserId == id)
               .Include(f => f.Novel)
                   .ThenInclude(n => n.NovelTags)
                       .ThenInclude(nt => nt.Tag)
               .ToListAsync();

            var novels = favorites.Select(f => f.Novel).ToList();


            var novelDtos = _mapper.Map<List<NovelReadDto>>(novels);

            var ids = novelDtos.Select(n => n.Id).ToList();
            var statsDict = await _statsService.GetStatsForNovelsAsync(ids);

            foreach (var dto in novelDtos)
                if (statsDict.TryGetValue(dto.Id, out var stats))
                    dto.Stats = stats;

            return Ok(novelDtos);
        }
        [HttpGet("user/{id}/readlater")]
        public async Task<ActionResult<IEnumerable<NovelReadDto>>> GetUserReadLaterNovels(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var readLaters = await _db.ReadLaters
               .Where(f => f.UserId == id)
               .Include(f => f.Novel)
                   .ThenInclude(n => n.NovelTags)
                       .ThenInclude(nt => nt.Tag)
               .ToListAsync();
            
            var novels = readLaters.Select(f => f.Novel).ToList();


            var novelDtos = _mapper.Map<List<NovelReadDto>>(novels);

            var ids = novelDtos.Select(n => n.Id).ToList();
            var statsDict = await _statsService.GetStatsForNovelsAsync(ids);

            foreach (var dto in novelDtos)
                if (statsDict.TryGetValue(dto.Id, out var stats))
                    dto.Stats = stats;

            return Ok(novelDtos);
        }

        private async Task ReplaceNovelCoverAsync(Novel novel, int newCoverId, int userId)
        {
            var newCoverTemp = await _db.UploadedFiles.FindAsync(newCoverId);
            if (newCoverTemp == null || newCoverTemp.UserId != userId || !newCoverTemp.IsTemporary)
                return;

            // Remove existing cover if any
            var oldCover = await _db.UploadedFiles
                .FirstOrDefaultAsync(f => f.NovelId == novel.Id && !f.IsTemporary);

            if (oldCover != null)
            {
                try
                {
                    if (System.IO.File.Exists(oldCover.FilePath))
                        System.IO.File.Delete(oldCover.FilePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete old cover file: {ex.Message}");
                }

                _db.UploadedFiles.Remove(oldCover);
            }

            // Move new temp file to permanent location
            var permDir = Path.Combine(_env.WebRootPath, "uploads", "covers", novel.UserId.ToString());
            if (!Directory.Exists(permDir))
                Directory.CreateDirectory(permDir);

            var newPath = Path.Combine(permDir, newCoverTemp.FileName);
            if (System.IO.File.Exists(newCoverTemp.FilePath))
                System.IO.File.Move(newCoverTemp.FilePath, newPath, true);

            var newUrl = $"{Request.Scheme}://{Request.Host}/uploads/covers/{novel.UserId}/{newCoverTemp.FileName}";

            newCoverTemp.FilePath = newPath;
            newCoverTemp.FileUrl = newUrl;
            newCoverTemp.IsTemporary = false;
            newCoverTemp.NovelId = novel.Id;
            newCoverTemp.ExpiresAt = null;

            novel.CoverImageUrl = newUrl;
        }

    }

}