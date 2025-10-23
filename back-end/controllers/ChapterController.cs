using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using AutoMapper;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/novels/{novelId}/chapters")]
    public class ChapterController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public ChapterController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
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

        [HttpPost]
        public async Task<ActionResult<ChapterReadDto>> CreateChapter(int novelId, [FromBody] CreateChapterDto createChapterDto)
        {
            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null)
                return NotFound("Novel not found!");

            var chapter = _mapper.Map<Chapter>(createChapterDto);

            chapter.NovelId = novelId;
            chapter.CreatedAt = DateTime.UtcNow;

            _db.Chapters.Add(chapter);
            await _db.SaveChangesAsync();

            var chapterDto = _mapper.Map<ChapterReadDto>(chapter);

            return CreatedAtAction(
                nameof(GetChapter),
                new { novelId = novelId, chapterId = chapter.Id },
                chapterDto
            );
        }

        [HttpPut("{chapterId}")]
        public async Task<IActionResult> UpdateChapter(int novelId, int chapterId, [FromBody] UpdateChapterDto updatedChapterDto)
        {
            var chapter = await _db.Chapters.FirstOrDefaultAsync(c => c.Id == chapterId && c.NovelId == novelId);
            if (chapter == null)
                return NotFound("Chapter not found");

            _mapper.Map(updatedChapterDto, chapter);
            
            chapter.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{chapterId}")]
        public async Task<IActionResult> DeleteChapter(int novelId, int chapterId)
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