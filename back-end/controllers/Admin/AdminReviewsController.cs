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
    [Route("api/admin/reviews")]
    public class AdminReviewsController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;
        private readonly INovelRankingService _rankingService;

        public AdminReviewsController(IWebHostEnvironment env, AppDbContext db, IMapper mapper, INovelStatsService statsService, INovelRankingService rankingService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
            _rankingService = rankingService;
        }

        // GET /api/admin/reviews Paginated list of reviews (filterable by user, novel, etc.)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadReviewDto>>> GetReviews(
            int? userId = null,
            int? novelId = null,
            string? search = null,
            int page = 1,
            int pageSize = 20)
        {
            var query = _db.Reviews
                .Include(r => r.User)
                .AsQueryable();

            if (userId.HasValue)
                query = query.Where(r => r.UserId == userId.Value);

            if (novelId.HasValue)
                query = query.Where(r => r.NovelId == novelId.Value);

            if (!string.IsNullOrWhiteSpace(search)){
                var normalizedSearch = search.Trim().ToLower();
                query = query.Where(r => 
                    r.ReviewContent.ToLower().Contains(normalizedSearch) ||
                    r.Title.ToLower().Contains(normalizedSearch)
                );
            }

            var reviews = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dto = _mapper.Map<IEnumerable<ReadReviewDto>>(reviews);
            return Ok(dto);
        }

        // DELETE /api/admin/reviews/{userId}/{novelId}
        [HttpDelete("{userId:int}/{novelId:int}")]
        public async Task<ActionResult> DeleteReview(int userId, int novelId)
        {
            var review = await _db.Reviews.FirstOrDefaultAsync(r => r.UserId == userId && r.NovelId == novelId);

            if (review == null)
                return NotFound("Review not found");

            _db.Reviews.Remove(review);
            await _db.SaveChangesAsync();

            // Update ratings after deletion
            await _statsService.UpdateRatingsAsync(novelId);

            return NoContent();
        }
        
    }

}