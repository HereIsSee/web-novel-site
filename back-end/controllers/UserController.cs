using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using Microsoft.AspNetCore.Identity;
using AutoMapper;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public UserController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserReadDto>>> GetUsers()
        {
            var users = await _db.Users.ToListAsync();
            var userDtos = _mapper.Map<IEnumerable<UserReadDto>>(users);
            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserReadDto>> GetUser(Guid id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            var dto = _mapper.Map<UserReadDto>(user);

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<UserReadDto>> CreateUser([FromBody] CreateUserDto dto)
        {
            var user = _mapper.Map<User>(dto);

            var hasher = new PasswordHasher<User>();
            user.PasswordHash = hasher.HashPassword(user, dto.Password);

            user.JoinedAt = DateTime.UtcNow;
            user.Id = Guid.NewGuid();

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var readDto = _mapper.Map<UserReadDto>(user);

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, readDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto updatedUser)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.UserName = updatedUser.UserName;
            user.Email = updatedUser.Email;
            user.DisplayName = updatedUser.DisplayName;
            user.Bio = updatedUser.Bio;
            user.AvatarUrl = updatedUser.AvatarUrl;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }

}