using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/comments")]
    public class CommentController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public CommentController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentReadDto>>> GetAllComments()
        {
            var comments = await _db.Comments
                .Include(c => c.User)
                .Include(c => c.Replies)
                .ToListAsync();

            var commentsDtos = _mapper.Map<IEnumerable<CommentReadDto>>(comments);

            return Ok(commentsDtos);
        }

        [HttpGet("chapter/{chapterId}")]
        public async Task<ActionResult<IEnumerable<CommentReadDto>>> GetChapterComments(int chapterId)
        {
            var comments = await _db.Comments
                .Include(c => c.User)
                .Include(c => c.Replies)
                .Where(c => c.ChapterId == chapterId)
                .ToListAsync();

            var commentsDtos = _mapper.Map<IEnumerable<CommentReadDto>>(comments);

            return Ok(commentsDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CommentReadDto>> GetComment(int id)
        {
            var comment = await _db.Comments
                .Include(c => c.User)
                .Include(c => c.Replies)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null)
                return NotFound();

            var commentDto = _mapper.Map<CommentReadDto>(comment);

            return Ok(commentDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CommentReadDto>> CreateComment([FromBody] CreateCommentDto createdComment)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });
            
            var chapter = await _db.Chapters.FindAsync(createdComment.ChapterId);
                if (chapter == null)
                    return BadRequest("Invalid ChapterId: chapter does not exist");

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return BadRequest("Invalid UserId: user does not exist.");
            
            if (createdComment.ParentCommentId != null)
            {
                var parentComment = await _db.Comments.FindAsync(createdComment.ParentCommentId);
                if (parentComment == null)
                    return BadRequest("Invalid ParentCommentId: comment does not exist");
            }

            var comment = _mapper.Map<Comment>(createdComment);
            comment.UserId = (int)userId;

            comment.CreatedAt = DateTime.UtcNow;

            _db.Comments.Add(comment);
            await _db.SaveChangesAsync();

            var commentDto = _mapper.Map<CommentReadDto>(comment);

            return CreatedAtAction(
                nameof(GetComment),
                new { id = comment.Id },
                commentDto
            );
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentDto updatedCommentDto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var comment = await _db.Comments.FindAsync(id);
            if (comment == null)
                return NotFound("Comment not found");
            if (comment.UserId != userId)
                return Forbid();

            _mapper.Map(updatedCommentDto, comment);

            comment.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var comment = await _db.Comments.FindAsync(id);
            if (comment == null)
                return NotFound("Comment not found");

            if (comment.UserId != userId)
                return Forbid();
            _db.Comments.Remove(comment);
            await _db.SaveChangesAsync();
            return NoContent();
        }

    }

}