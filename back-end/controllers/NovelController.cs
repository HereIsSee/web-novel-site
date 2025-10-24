using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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

        public NovelController(IWebHostEnvironment env, AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NovelReadDto>>> GetNovels()
        {
            var novels = await _db.Novels
                .Include(n => n.User)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .ToListAsync();

            var novelDtos = _mapper.Map<IEnumerable<NovelReadDto>>(novels);

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

            var novelDtos = _mapper.Map<IEnumerable<NovelReadDto>>(novels);

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