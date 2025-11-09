using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using AutoMapper;
using System.Text.RegularExpressions;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/admin/chapters")]
    public class AdminChaptersController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;
        private readonly INovelRankingService _rankingService;

        public AdminChaptersController(IWebHostEnvironment env, AppDbContext db, IMapper mapper,INovelStatsService statsService, INovelRankingService rankingService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
            _rankingService = rankingService;
        }

        [HttpPut("{chapterId}")]
        public async Task<IActionResult> UpdateChapter(int chapterId, [FromBody] UpdateChapterDto updatedChapterDto)
        {

            var chapter = await _db.Chapters.FindAsync(chapterId);
            if (chapter == null)
                return NotFound(new { message = "Chapter not found" });

            var novelId = chapter.NovelId;
            
            _mapper.Map(updatedChapterDto, chapter);

            chapter.UpdatedAt = DateTime.UtcNow;
            chapter.WordCount = CountWordsFromHtml(chapter.Content);

            await _db.SaveChangesAsync();
            await _statsService.UpdateChaptersAsync(novelId);
            return NoContent();
        }

        [HttpDelete("{chapterId}")]
        public async Task<IActionResult> DeleteChapter(int chapterId)
        {
            var chapter = await _db.Chapters.FindAsync(chapterId);

            if (chapter == null)
                return NotFound(new { message = "Chapter not found" });

            var novelId = chapter.NovelId;

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