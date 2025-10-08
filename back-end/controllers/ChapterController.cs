using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/novels/{novelId}/chapters")]
    public class ChapterController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ChapterController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Chapter>>> GetChapters(Guid novelId)
        {
            var novelExists = await _db.Novels.AnyAsync(n => n.Id == novelId);
            if (!novelExists)
                return NotFound("Novel not found!");

            var chapters = await _db.Chapters
                .Where(c => c.NovelId == novelId)
                .ToListAsync();

            return Ok(chapters);
        }

        [HttpGet("{chapterId}")]
        public async Task<ActionResult<Chapter>> GetChapter(Guid novelId, Guid chapterId)
        {
            var chapter = await _db.Chapters
                .Include(c => c.Comments)
                .FirstOrDefaultAsync(c => c.Id == chapterId && c.NovelId == novelId);

            if (chapter == null)
                return NotFound();

            return Ok(chapter);
        }

        [HttpPost]
        public async Task<ActionResult<Chapter>> CreateChapter(Guid novelId, [FromBody] Chapter chapter)
        {
            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null)
                return NotFound("Novel not found!");

            chapter.Id = Guid.NewGuid();
            chapter.NovelId = novelId;
            chapter.CreatedAt = DateTime.UtcNow;

            _db.Chapters.Add(chapter);
            await _db.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetChapter),
                new { novelId = novelId, chapterId = chapter.Id },
                chapter
            );
        }

        [HttpPut("{chapterId}")]
        public async Task<IActionResult> UpdateChapter(Guid novelId, Guid chapterId, [FromBody] Chapter updatedChapter)
        {
            var chapter = await _db.Chapters.FirstOrDefaultAsync(c => c.Id == chapterId && c.NovelId == novelId);
            if (chapter == null)
                return NotFound();

            chapter.Title = updatedChapter.Title;
            chapter.Content = updatedChapter.Content;
            chapter.ChapterNumber = updatedChapter.ChapterNumber;
            chapter.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{chapterId}")]
        public async Task<IActionResult> DeleteChapter(Guid novelId, Guid chapterId)
        {
            var chapter = await _db.Chapters.FirstOrDefaultAsync(c => c.Id == chapterId && c.NovelId == novelId);
            if (chapter == null)
                return NotFound();

            _db.Chapters.Remove(chapter);
            await _db.SaveChangesAsync();
            return NoContent();
        }


    }

}