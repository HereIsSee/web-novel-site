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

        public PublicNovelController(IWebHostEnvironment env, AppDbContext db, IMapper mapper,INovelStatsService statsService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
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

        
    }

}