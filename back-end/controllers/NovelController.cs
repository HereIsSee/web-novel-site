using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using AutoMapper;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/novels")]
    public class NovelController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public NovelController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NovelReadDto>>> GetNovels()
        {
            var novels = await _db.Novels
                .Include(n => n.User)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .ToListAsync();

            var novelDtos = _mapper.Map<IEnumerable<NovelReadDto>>(novels);

            return Ok(novels);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NovelReadDto>> GetNovel(int id)
        {
            var novel = await _db.Novels
                .Include(n => n.User)
                .Include(n => n.NovelTags)
                    .ThenInclude(nt => nt.Tag)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (novel == null)
                return NotFound("Novel not found");

            var novelDto = _mapper.Map<NovelReadDto>(novel);

            return Ok(novelDto);
        }

        [HttpPost]
        public async Task<ActionResult<NovelReadDto>> CreateNovel([FromBody] CreateNovelDto novelDto)
        {
            if (!Enum.IsDefined(typeof(NovelStatus), novelDto.Status))
                return BadRequest($"Invalid novel status: {novelDto.Status}");
            
            var user = await _db.Users.FindAsync(novelDto.UserId);
            if (user == null)
                return BadRequest($"User with id {novelDto.UserId} does not exist.");

            var novel = _mapper.Map<Novel>(novelDto);

            novel.CreatedAt = DateTime.UtcNow;

            _db.Novels.Add(novel);
            await _db.SaveChangesAsync();

            var novelReadDto = _mapper.Map<NovelReadDto>(novel);

            return CreatedAtAction(nameof(GetNovel), new { id = novel.Id }, novelReadDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNovel(int id, [FromBody] UpdateNovelDto updatedNovelDto)
        {
            if (updatedNovelDto.Status != null && !Enum.IsDefined(typeof(NovelStatus), updatedNovelDto.Status))
                return BadRequest($"Invalid novel status: {updatedNovelDto.Status}");
            
            var novel = await _db.Novels.FindAsync(id);

            if (novel == null)
                return NotFound();

            _mapper.Map(updatedNovelDto, novel);

            novel.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNovel(int id)
        {
            var novel = await _db.Novels.FindAsync(id);

            if (novel == null)
                return NotFound();

            _db.Novels.Remove(novel);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{novelId}/tags/{tagId`}")]
        public async Task<IActionResult> AddTagToNovel(int novelId, int tagId)
        {
            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null) return NotFound();

            var tag = await _db.Tags.FindAsync(tagId);
            if (novel == null) return NotFound();

            if (!await _db.NovelTags.AnyAsync(nt => nt.NovelId == novelId && nt.TagId == tagId))
            {
                _db.NovelTags.Add(new NovelTag { NovelId = novelId, TagId = tagId });
                await _db.SaveChangesAsync();
            }

            return NoContent();
        }

        [HttpDelete("{novelId}/tags/{tagId}")]
        public async Task<IActionResult> RemoveTagFromNovel(int novelId, int tagId)
        {
            var novelTag = await _db.NovelTags.FirstOrDefaultAsync(nt => nt.NovelId == novelId && nt.TagId == tagId);
            if (novelTag == null) return NotFound();

            _db.NovelTags.Remove(novelTag);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }

}