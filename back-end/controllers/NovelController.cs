using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/novels")]
    public class NovelController : ControllerBase
    {
        private readonly AppDbContext _db;

        public NovelController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Novel>>> GetNovels()
        {
            var novels = await _db.Novels
                .Include(n => n.User)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .ToListAsync();

            return Ok(novels);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Novel>> GetNovel(Guid id)
        {
            var novel = await _db.Novels
                .Include(n => n.User)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .Include(n => n.Chapters)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (novel == null)
                return NotFound();

            return Ok(novel);
        }

        [HttpPost]
        public async Task<ActionResult<Novel>> CreateNovel([FromBody] Novel novel)
        {
            novel.Id = Guid.NewGuid();
            novel.CreatedAt = DateTime.UtcNow;

            _db.Novels.Add(novel);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNovel), new { id = novel.Id }, novel);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNovel(Guid id, [FromBody] Novel updatedNovel)
        {
            var novel = await _db.Novels.FindAsync(id);

            if (novel == null)
                return NotFound();

            novel.Title = updatedNovel.Title;
            novel.Synopsis = updatedNovel.Synopsis;
            novel.CoverImageUrl = updatedNovel.CoverImageUrl;
            novel.UpdatedAt = DateTime.UtcNow;
            novel.Status = updatedNovel.Status;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNovel(Guid id)
        {
            var novel = await _db.Novels.FindAsync(id);

            if (novel == null)
                return NotFound();

            _db.Novels.Remove(novel);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{novelId}/tags/{tagId`}")]
        public async Task<IActionResult> AddTagToNovel(Guid novelId, Guid tagId)
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
        public async Task<IActionResult> RemoveTagFromNovel(Guid novelId, Guid tagId)
        {
            var novelTag = await _db.NovelTags.FirstOrDefaultAsync(nt => nt.NovelId == novelId && nt.TagId == tagId);
            if (novelTag == null) return NotFound();

            _db.NovelTags.Remove(novelTag);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }

}