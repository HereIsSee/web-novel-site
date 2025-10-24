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
        public async Task<IActionResult> UpdateNovel(int id, [FromBody] UpdateNovelDto updatedNovelDto)
        {
            if (updatedNovelDto.Status != null && !Enum.IsDefined(typeof(NovelStatus), updatedNovelDto.Status))
                return BadRequest($"Invalid novel status: {updatedNovelDto.Status}");

            var novel = await _db.Novels.FindAsync(id);

            if (novel == null)
                return NotFound();

            _mapper.Map(updatedNovelDto, novel);

            novel.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return NoContent();
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
    }

}