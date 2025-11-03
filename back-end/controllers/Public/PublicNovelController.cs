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
    [Route("api/public-novels")]
    public class PublicNovelController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;
        private readonly INovelRankingService _rankingService;

        public PublicNovelController(IWebHostEnvironment env, AppDbContext db, IMapper mapper,INovelStatsService statsService, INovelRankingService rankingService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
            _rankingService = rankingService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NovelReadDto>>> GetNovels()
        {
            var novels = await _db.Novels
                .Where(n => n.Status != NovelStatus.Draft && n.Status != NovelStatus.Hidden)
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
                .Where(n => n.Status != NovelStatus.Draft && n.Status != NovelStatus.Hidden)
                .Include(n => n.User)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (novel == null)
                return NotFound("Novel not found or hidden");

            var novelDto = _mapper.Map<NovelReadDto>(novel);

            var stats = await _statsService.GetNovelStatsAsync(id);

            novelDto.Stats = stats;

            return Ok(novelDto);
        }

        [HttpGet("top")]
        public async Task<ActionResult<IEnumerable<NovelReadDto>>> GetTopNovels(
            [FromQuery] int count = 5,
            [FromQuery] NovelStatus? status = null)
        {
            var query = _db.Novels
                .Where(n => n.Status != NovelStatus.Draft && n.Status != NovelStatus.Hidden);

            if (status.HasValue)
                query = query.Where(n => n.Status == status.Value);

            var novelIds = await query
                .Select(n => n.Id)
                .ToListAsync();

            var statsDict = await _statsService.GetStatsForNovelsAsync(novelIds);

            var topIds = statsDict
                .Select(x => new { Id = x.Key, Score = _rankingService.CalculatePopularity(x.Value) })
                .OrderByDescending(x => x.Score)
                .Take(count)
                .Select(x => x.Id)
                .ToList();

            var novels = await _db.Novels
                .Where(n => topIds.Contains(n.Id))
                .Include(n => n.User)
                .Include(n => n.NovelTags).ThenInclude(nt => nt.Tag)
                .ToListAsync();

            var result = _mapper.Map<List<NovelReadDto>>(novels);

            foreach (var dto in result)
                if (statsDict.TryGetValue(dto.Id, out var stats))
                    dto.Stats = stats;

            return Ok(result);
        }

        [HttpGet("latest")]
        public async Task<ActionResult<IEnumerable<NovelWithChaptersDto>>> GetLatestNovels(
            [FromQuery] int count = 5)
        {
            var novels = await _db.Novels
                .Where(n => n.Status != NovelStatus.Draft && n.Status != NovelStatus.Hidden)
                .Include(n => n.User)
                .Include(n => n.Chapters)
                .OrderByDescending(n => n.Chapters.Max(c => c.CreatedAt))
                .Take(count)
                .ToListAsync();

            var novelDtos = _mapper.Map<List<NovelWithChaptersDto>>(novels);

            // Step 3: Filter chapters to those uploaded within 1 hour of latest chapter
            foreach (var dto in novelDtos)
            {
                if (dto.Chapters.Count == 0) continue;

                var latestChapterDate = dto.Chapters.Max(c => c.CreatedAt);
                dto.Chapters = dto.Chapters
                    .Where(c => (latestChapterDate - c.CreatedAt).TotalHours <= 1)
                    .OrderByDescending(c => c.ChapterNumber)
                    .Take(5)
                    .ToList();
            }

            return Ok(novelDtos);
        }


        
    }

}