using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Text.RegularExpressions;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/novels/{novelId}/chapters")]
    public class ChapterController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly INovelStatsService _statsService;

        public ChapterController(AppDbContext db, IMapper mapper, INovelStatsService statsService)
        {
            _db = db;
            _mapper = mapper;
            _statsService = statsService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChapterReadDto>>> GetChapters(int novelId)
        {
            var novelExists = await _db.Novels.AnyAsync(n => n.Id == novelId);
            if (!novelExists)
                return NotFound("Novel not found!");

            var chapters = await _db.Chapters
                .Where(c => c.NovelId == novelId)
                .ToListAsync();

            var chaptersDto = _mapper.Map<IEnumerable<ChapterReadDto>>(chapters);

            return Ok(chaptersDto);
        }

        [HttpGet("{chapterId}")]
        public async Task<ActionResult<ChapterReadDto>> GetChapter(int novelId, int chapterId)
        {
            var chapter = await _db.Chapters
                .FirstOrDefaultAsync(c => c.Id == chapterId && c.NovelId == novelId);

            if (chapter == null)
                return NotFound();

            var chapterDto = _mapper.Map<ChapterReadDto>(chapter);

            return Ok(chapterDto);
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ChapterReadDto>> CreateChapter(int novelId, [FromBody] CreateChapterDto createChapterDto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null)
                return NotFound("Novel not found!");
            
            if (novel.UserId != userId)
                return Forbid();

            var chapter = _mapper.Map<Chapter>(createChapterDto);

            chapter.NovelId = novelId;
            chapter.CreatedAt = DateTime.UtcNow;
            chapter.WordCount = CountWordsFromHtml(chapter.Content);

            var lastChapterNumber = await _db.Chapters
                .Where(c => c.NovelId == novelId)
                .OrderByDescending(c => c.ChapterNumber)
                .Select(c => c.ChapterNumber)
                .FirstOrDefaultAsync();

            chapter.ChapterNumber = lastChapterNumber + 1;

            _db.Chapters.Add(chapter);
            await _db.SaveChangesAsync();
            await _statsService.UpdateChaptersAsync(novelId);

            var chapterDto = _mapper.Map<ChapterReadDto>(chapter);

            return CreatedAtAction(
                nameof(GetChapter),
                new { novelId = novelId, chapterId = chapter.Id },
                chapterDto
            );
        }
        [Authorize]
        [HttpPut("{chapterId}")]
        public async Task<IActionResult> UpdateChapter(int novelId, int chapterId, [FromBody] UpdateChapterDto updatedChapterDto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });
            
            var chapter = await _db.Chapters.FirstOrDefaultAsync(c => c.Id == chapterId && c.NovelId == novelId);
            if (chapter == null)
                return NotFound("Chapter not found");
            
            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null)
                return NotFound("Novel not found!");
            
            if (novel.UserId != userId)
                return Forbid();

            _mapper.Map(updatedChapterDto, chapter);

            chapter.UpdatedAt = DateTime.UtcNow;
            chapter.WordCount = CountWordsFromHtml(chapter.Content);

            await _db.SaveChangesAsync();
            await _statsService.UpdateChaptersAsync(novelId);
            return NoContent();
        }
        [Authorize]
        [HttpDelete("{chapterId}")]
        public async Task<IActionResult> DeleteChapter(int novelId, int chapterId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return BadRequest(new { message = $"User with id {userId} does not exist." });
            

            var chapter = await _db.Chapters
                .Include(c => c.Novel)
                .FirstOrDefaultAsync(c => c.Id == chapterId && c.NovelId == novelId);
            if (chapter == null)
                return NotFound();
            if(userId != chapter.Novel.UserId)
                return Forbid();

            _db.Chapters.Remove(chapter);
            await _db.SaveChangesAsync();
            await _statsService.UpdateChaptersAsync(novelId);
            return NoContent();
        }

        private int CountWordsFromHtml(string html)
        {
            if (string.IsNullOrWhiteSpace(html))
                return 0;

            var text = Regex.Replace(html, "<.*?>", " ");

            text = System.Net.WebUtility.HtmlDecode(text);

            return text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
        }

    }

}