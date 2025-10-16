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
                return NotFound();

            var updatedComment = _mapper.Map<Comment>(updatedCommentDto);

            comment.Content = updatedComment.Content;
            comment.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _db.Comments.FindAsync(id);
            if (comment == null)
                return NotFound();

            _db.Comments.Remove(comment);
            await _db.SaveChangesAsync();
            return NoContent();
        }

    }

}