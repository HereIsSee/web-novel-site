using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Api.Helpers;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public ReviewsController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadReviewDto>>> GetReviews()
        {
            var reviews = await _db.Reviews
                .Include(r => r.User)
                .ToListAsync();

            var reviewsDto = _mapper.Map<IEnumerable<ReadReviewDto>>(reviews);

            return Ok(reviewsDto);
        }

        [HttpGet("novel/{novelId}")]
        public async Task<ActionResult<IEnumerable<ReadReviewDto>>> GetNovelReviews(int novelId)
        {
            var reviews = await _db.Reviews
                .Where(r => r.NovelId == novelId)
                .Include(r => r.User)
                .ToListAsync();

            var reviewsDto = _mapper.Map<IEnumerable<ReadReviewDto>>(reviews);

            return Ok(reviewsDto);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ReadReviewDto>>> GetUserReviews(int userId)
        {
            var reviews = await _db.Reviews
                .Where(r => r.UserId == userId)
                .Include(r => r.User)
                .ToListAsync();

            var reviewsDto = _mapper.Map<IEnumerable<ReadReviewDto>>(reviews);

            return Ok(reviewsDto);
        }
        
        [HttpGet("{reviewId}")]
        public async Task<ActionResult<ReadReviewDto>> GetReview(int reviewId)
        {
            var review = await _db.Reviews.FindAsync(reviewId);

            var reviewDto = _mapper.Map<ReadReviewDto>(review);

            return Ok(reviewDto);  
        }

        [Authorize]
        [HttpPost("novel/{novelId}")]
        public async Task<ActionResult<ReadReviewDto>> CreateReview(int novelId, [FromBody] CreateReviewDto reviewDto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null)
                return NotFound(new { message = "Novel not found" });

            var exists = await _db.Reviews
                .AnyAsync(r => r.UserId == userId && r.NovelId == novelId);
            if (exists)
                return Conflict(new { message = "You have already reviewed this novel. Use PUT to update it." });

            if (!ReviewValidator.Validate(reviewDto, out var error))
                return BadRequest(new { message = error });

            var review = _mapper.Map<Review>(reviewDto);
            review.UserId = userId.Value;
            review.NovelId = novelId;
            review.CreatedAt = DateTime.UtcNow;

            _db.Reviews.Add(review);
            await _db.SaveChangesAsync();

            var savedReview = await _db.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.UserId == userId && r.NovelId == novelId);

            var readDto = _mapper.Map<ReadReviewDto>(savedReview);

            return Ok(readDto);

        }

        [Authorize]
        [HttpPut("novel/{novelId}")]
        public async Task<ActionResult<ReadReviewDto>> UpdateReview(int novelId, [FromBody] UpdateReviewDto reviewDto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null)
                return NotFound(new { message = "Novel not found" });

            var exists = await _db.Reviews
                .AnyAsync(r => r.UserId == userId && r.NovelId == novelId);
            if (!exists)
                return Conflict(new { message = "You have not reviewed this novel. Use POST to create it." });

            if (!ReviewValidator.Validate(reviewDto, out var error))
                return BadRequest(new { message = error });

            var review = await _db.Reviews.FirstAsync(r => r.UserId == userId && r.NovelId == novelId);

            _mapper.Map(reviewDto, review);
            review.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            var updatedReviewDto = await _db.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.UserId == userId && r.NovelId == novelId);

            var readDto = _mapper.Map<ReadReviewDto>(updatedReviewDto);

            return Ok(updatedReviewDto);
        }

        [Authorize]
        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            // Will have to update so that the admin can also delete reviews
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var review = await _db.Reviews.FindAsync(reviewId);
            if (review == null)
                return NotFound(new { message = "Review not found" });

            if (review.UserId != userId)
                return BadRequest(new { message = "Only the user who created the review can delete it." });

            _db.Reviews.Remove(review);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Review deleted." });
        }


    }

}