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
                .Include(n => n.Stats)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .ToListAsync();
            
            var novelDtos = _mapper.Map<List<NovelReadDto>>(novels);

            return Ok(novelDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NovelReadDto>> GetNovel(int id)
        {
            var novel = await _db.Novels
                .Where(n => n.Status != NovelStatus.Draft && n.Status != NovelStatus.Hidden)
                .Include(n => n.User)
                .Include(n => n.Stats)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (novel == null)
                return NotFound("Novel not found or hidden");

            var novelDto = _mapper.Map<NovelReadDto>(novel);

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

            var novels = await query
                .Include(n => n.Stats)
                .Include(n => n.User)
                .Include(n => n.NovelTags).ThenInclude(nt => nt.Tag)
                .OrderByDescending(n => n.Stats!.Popularity)
                .Take(count)
                .ToListAsync();

            var result = _mapper.Map<List<NovelReadDto>>(novels);

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