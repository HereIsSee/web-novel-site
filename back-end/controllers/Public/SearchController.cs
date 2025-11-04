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
    [Route("api/[controller]")]
    public class SearchController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;
        private readonly INovelRankingService _rankingService;

        public SearchController(IWebHostEnvironment env, AppDbContext db, IMapper mapper, INovelStatsService statsService, INovelRankingService rankingService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
            _rankingService = rankingService;
        }

        [HttpGet("order-by")]
        public ActionResult<IEnumerable<object>> GetNovelStatuses()
        {
            var orderBy = Enum.GetValues(typeof(OrderBy))
                            .Cast<OrderBy>()
                            .Select(s => new
                            {
                                key = s.ToString(),
                                value = (int)s
                            })
                            .ToList();

            return Ok(orderBy);
        }
        
        [HttpPost("basic")]
        public async Task<ActionResult<IEnumerable<Novel>>> BasicSearch([FromBody] BasicSearchDto dto)
        {
            var query = _db.Novels
                .Include(n => n.User)
                .Include(n => n.Stats)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(dto.Title))
            {
                query = query.Where(n  => n.Title.ToLower().Contains(dto.Title.ToLower()));
            }

            var result = await query
                .OrderByDescending(n => n.UpdatedAt)
                .ToListAsync();

            var novelDtos = _mapper.Map<List<NovelReadDto>>(result);

            return Ok(novelDtos);
        }

        [HttpPost("advanced")]
        public async Task<ActionResult<IEnumerable<Novel>>> AdvancedSearch([FromBody] AdvancedSearchDto dto)
        {
            var query = _db.Novels
                .Include(n => n.User)
                .Include(n => n.Stats)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .AsQueryable();
            
            if (!string.IsNullOrWhiteSpace(dto.Title))
                query = query.Where(n => n.Title.ToLower().Contains(dto.Title.ToLower()));

            if (!string.IsNullOrWhiteSpace(dto.AuthorUsername))
                query = query.Where(n => n.User.UserName.ToLower().Contains(dto.AuthorUsername.ToLower()));


            if (dto.TagsIds != null && dto.TagsIds.Any())
                query = query.Where(n => n.NovelTags.Any(nt => dto.TagsIds.Contains(nt.TagId)));

            if (dto.Pages != null)
            {
                if (dto.Pages.From.HasValue)
                    query = query.Where(n => n.Stats != null && n.Stats.WordCount / 275 >= dto.Pages.From); // rough words to pages
                if (dto.Pages.To.HasValue)
                    query = query.Where(n => n.Stats != null && n.Stats.WordCount / 275 <= dto.Pages.To);
            }

            if (dto.Rating != null)
            {
                if (dto.Rating.From.HasValue)
                    query = query.Where(n => n.Stats != null && n.Stats.OverallScore >= dto.Rating.From);
                if (dto.Rating.To.HasValue)
                    query = query.Where(n => n.Stats != null && n.Stats.OverallScore <= dto.Rating.To);
            }

            if (dto.StatusEnumValues != null && dto.StatusEnumValues.Any())
                query = query.Where(n => dto.StatusEnumValues.Contains(n.Status));

            query = dto.OrderBy switch
            {
                OrderBy.LastUpdate => dto.Ascending ? query.OrderBy(n => n.UpdatedAt) : query.OrderByDescending(n => n.UpdatedAt),
                OrderBy.ReleaseDate => dto.Ascending ? query.OrderBy(n => n.CreatedAt) : query.OrderByDescending(n => n.CreatedAt),
                OrderBy.Followers => dto.Ascending ? query.OrderBy(n => n.Stats.FollowsCount) : query.OrderByDescending(n => n.Stats.FollowsCount),
                OrderBy.NumberOfPages => dto.Ascending ? query.OrderBy(n => n.Stats.WordCount / 300) : query.OrderByDescending(n => n.Stats.WordCount / 300),
                OrderBy.Views => dto.Ascending ? query.OrderBy(n => n.Stats.Views) : query.OrderByDescending(n => n.Stats.Views),
                OrderBy.Title => dto.Ascending ? query.OrderBy(n => n.Title) : query.OrderByDescending(n => n.Title),
                OrderBy.Author => dto.Ascending ? query.OrderBy(n => n.User.UserName) : query.OrderByDescending(n => n.User.UserName),
                _ => query.OrderByDescending(n => n.UpdatedAt)
            };

            var novels = await query.ToListAsync();

            var novelDtos = _mapper.Map<List<NovelReadDto>>(novels);

            return Ok(novelDtos);
        }
        
    }

}