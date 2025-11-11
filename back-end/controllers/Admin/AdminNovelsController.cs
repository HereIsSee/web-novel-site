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
    [Route("api/admin/novels")]
    [Authorize(Roles = "Admin")]
    public class AdminNovelsController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;
        private readonly INovelRankingService _rankingService;

        public AdminNovelsController(IWebHostEnvironment env, AppDbContext db, IMapper mapper, INovelStatsService statsService, INovelRankingService rankingService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
            _rankingService = rankingService;
        }


        // GET  /api/admin/novels	Paginated list of novels (with filters)
        [HttpGet]
        public async Task<IActionResult> GetNovelsAsync(
            string? search = null,
            int page = 1,
            int pageSize = 20)
        {
            var query = _db.Novels
                .Include(n => n.User)
                .Include(n => n.Stats)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .AsQueryable();
            
            if (!string.IsNullOrWhiteSpace(search))
            {
                var normalizedSearch = search.Trim().ToLower();
                query = query.Where(r =>
                    r.Title.ToLower().Contains(normalizedSearch) ||
                    (r.Synopsis != null && r.Synopsis.ToLower().Contains(normalizedSearch))
                );
            }

            var totalCount = await query.CountAsync();

            var novelList = await query
                .OrderBy(u => u.Title)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var novelDtos = _mapper.Map<List<NovelReadDto>>(novelList);

            return Ok(new { totalCount, novels = novelDtos });
        }

        // GET  	/api/admin/novels/{novelId} 	    Get full novel details
        [HttpGet("{novelId}")]
        public async Task<ActionResult<NovelReadDto>> GetNovelByIdAsync(int novelId)
        {
            var novel = await _db.Novels
                .Include(n => n.User)
                .Include(n => n.Stats)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .FirstOrDefaultAsync(n => n.Id == novelId);

            if (novel == null)
                return NotFound("Novel not found");

            var novelDto = _mapper.Map<NovelReadDto>(novel);

            return Ok(novelDto);
        }
        // PUT	    /api/admin/novels/{novelId}	        Edit novel metadata (title, synopsis, tags, genre, cover, status)
        [HttpPut("{id}")]
        public async Task<ActionResult<NovelReadDto>> UpdateNovel(int id, [FromBody] UpdateNovelDto novelDto)
        {
            var currentUserId = GetCurrentUserId();
            
            var novel = await _db.Novels
                .Include(n => n.NovelTags)
                .Include(n => n.Chapters)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (novel == null)
                return NotFound(new { message = "Novel not found." });

            if (novelDto.Status != null)
            {
                if (!Enum.IsDefined(typeof(NovelStatus), novelDto.Status))
                    return BadRequest(new { message = $"Invalid novel status: {novelDto.Status}" });

                if (novelDto.Status != NovelStatus.Draft && (novel.Chapters?.Count ?? 0) == 0)
                {
                    return BadRequest(new
                    {
                        message = "You must add at least 1 chapter before changing the novel's status."
                    });
                }

            }
            if (novelDto.Tags != null && !novelDto.Tags.Any())
                return BadRequest(new { message = "A novel must have at least one tag." });

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
                await ReplaceNovelCoverAsync(novel, novelDto.CoverImageId.Value, currentUserId.Value);

            await _db.SaveChangesAsync();
            await _statsService.RecalculateAllStatsAsync(novel.Id);


            var novelReadDto = _mapper.Map<NovelReadDto>(novel);
            return Ok(novelReadDto);
        }

        // DELETE	/api/admin/novels/{novelId}	Hard delete novel (rare, irreversible)
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