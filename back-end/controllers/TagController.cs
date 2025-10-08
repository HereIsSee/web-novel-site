using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/tags")]
    public class TagController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TagController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tag>>> GetTags()
        {
            var tags = await _db.Tags.ToListAsync();

            return Ok(tags);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Tag>> GetTag(Guid id)
        {
            var tag = await _db.Tags.FindAsync(id);
            if (tag == null)
                return NotFound();

            return Ok(tag);
        }

        [HttpPost]
        public async Task<ActionResult<Tag>> CreateTag([FromBody] Tag tag)
        {
            tag.Id = Guid.NewGuid();
            _db.Tags.Add(tag);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTag), new { id = tag.Id }, tag);
        }

        [HttpPut("id")]
        public async Task<IActionResult> UpdateTag(Guid id, [FromBody] Tag updatedTag)
        {
            var tag = await _db.Tags.FindAsync(id);
            if (tag == null)
                return NotFound();

            tag.Name = updatedTag.Name;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("id")]
        public async Task<IActionResult> DeleteTag(Guid id)
        {
            var tag = await _db.Tags.FindAsync(id);
            if (tag == null)
                return NotFound();

            _db.Tags.Remove(tag);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

}