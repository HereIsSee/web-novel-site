using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using AutoMapper;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/comments")]
    public class CommentController : ControllerBase
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

        [HttpPost]
        public async Task<ActionResult<CommentReadDto>> CreateComment([FromBody] CreateCommentDto createdComment)
        {
            if (createdComment.NovelId == null && createdComment.ChapterId == null)
                return BadRequest("Comment must be associated with either a Novel or a Chapter.");
            else if (createdComment.NovelId != null)
            {
                var novel = await _db.Novels.FindAsync(createdComment.NovelId);
                if (novel == null) return BadRequest("Invalid NovelId: novel does not exist.");
            }
            else
            {
                var chapter = await _db.Chapters.FindAsync(createdComment.ChapterId);
                if (chapter == null)
                    return BadRequest("Invalid ChapterId: chapter does not exist");
            }

            var user = await _db.Users.FindAsync(createdComment.UserId);
            if (user == null)
                return BadRequest("Invalid UserId: user does not exist.");
            
            if (createdComment.ParentCommentId != null)
            {
                var parentComment = await _db.Comments.FindAsync(createdComment.ParentCommentId);
                if (parentComment == null)
                    return BadRequest("Invalid ParentCommentId: comment does not exist");
            }
            
            var comment = _mapper.Map<Comment>(createdComment);

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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentDto updatedCommentDto)
        {
            var comment = await _db.Comments.FindAsync(id);
            if (comment == null)
                return NotFound("Comment not found");

            _mapper.Map(updatedCommentDto, comment);

            comment.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return NoContent();
        }

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