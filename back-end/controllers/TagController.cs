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
    [Route("api/tags")]
    public class TagController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public TagController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetTags()
        {
            var tags = await _db.Tags.ToListAsync();

            var tagsDto = _mapper.Map<IEnumerable<TagDto>>(tags);

            return Ok(tagsDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> GetTag(int id)
        {
            var tag = await _db.Tags.FindAsync(id);
            if (tag == null)
                return NotFound();

            return Ok(tag);
        }

        [HttpPost]
        public async Task<ActionResult<TagDto>> CreateTag([FromBody] TagDto tagDto)
        {
            var repeatingTag = await _db.Tags.FirstOrDefaultAsync(t => t.Name == tagDto.Name);
            if (repeatingTag != null)
                return Conflict(new { message = "Tag with this name already exists" });

            var tag = _mapper.Map<Tag>(tagDto);

            _db.Tags.Add(tag);
            await _db.SaveChangesAsync();

            var tagReadDto = _mapper.Map<TagDto>(tag);

            return CreatedAtAction(nameof(GetTag), new { id = tag.Id }, tagReadDto);
        }
        
        [HttpPost("bulk")]
        public async Task<ActionResult<IEnumerable<TagDto>>> CreateTags([FromBody] IEnumerable<TagDto> tagDtos)
        {
            if (tagDtos == null || !tagDtos.Any())
                return BadRequest(new { message = "No tags provided." });

            // Optional: filter out duplicates by name
            var existingTagNames = await _db.Tags
                .Select(t => t.Name)
                .ToListAsync();

            var newTags = tagDtos
                .Where(t => !existingTagNames.Contains(t.Name))
                .Select(t => _mapper.Map<Tag>(t))
                .ToList();

            if (!newTags.Any())
                return Conflict(new { message = "All provided tags already exist." });

            await _db.Tags.AddRangeAsync(newTags);
            await _db.SaveChangesAsync();

            var createdDtos = _mapper.Map<IEnumerable<TagDto>>(newTags);

            return CreatedAtAction(nameof(GetTags), createdDtos);
        }


        [HttpPut("id")]
        public async Task<IActionResult> UpdateTag(int id, [FromBody] TagDto updatedTagDto)
        {
            var tag = await _db.Tags.FindAsync(id);
            if (tag == null)
                return NotFound();

            _mapper.Map(updatedTagDto, tag);

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("id")]
        public async Task<IActionResult> DeleteTag(int id)
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