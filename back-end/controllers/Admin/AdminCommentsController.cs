using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/admin/comments")]
    [Authorize(Roles = "Admin")]
    public class AdminCommentsController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;
        private readonly INovelRankingService _rankingService;

        public AdminCommentsController(IWebHostEnvironment env, AppDbContext db, IMapper mapper, INovelStatsService statsService, INovelRankingService rankingService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
            _rankingService = rankingService;
        }

        // GET /api/admin/comments Paginated list of comments (filterable by user, novel, etc.)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentReadDto>>> GetCommentsAsync(
            string? search = null,
            int page = 1,
            int pageSize = 20)
        {
            var query = _db.Comments
                .Include(c => c.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var normalizedSearch = search.Trim().ToLower();
                query = query.Where(c =>
                    c.Content.ToLower().Contains(normalizedSearch) ||
                    c.User.UserName.ToLower().Contains(normalizedSearch)
                );
            }
            
            var totalCount = await query.CountAsync();

            var commentList = await query
                .OrderBy(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var commentsDtos = _mapper.Map<IEnumerable<CommentReadDto>>(commentList);

            return Ok(new { totalCount, comments = commentsDtos });;
        }

        // DELETE	/api/admin/comments/{commentId}	Hard delete a comment
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _db.Comments.FindAsync(id);
            if (comment == null)
                return NotFound("Comment not found");

            _db.Comments.Remove(comment);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        
    }

}