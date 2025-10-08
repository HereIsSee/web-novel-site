using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UserController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserReadDto>>> GetUsers()
        {
            var users = await _db.Users
            .Select(u => new UserReadDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                DisplayName = u.DisplayName,
                Bio = u.Bio,
                AvatarUrl = u.AvatarUrl,
                JoinedAt = u.JoinedAt,
                Role = u.Role
            })
            .ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserReadDto>> GetUser(Guid id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            var dto = new UserReadDto
            {

                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Bio = user.Bio,
                AvatarUrl = user.AvatarUrl,
                JoinedAt = user.JoinedAt,
                Role = user.Role
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<UserReadDto>> CreateUser([FromBody] CreateUserDto dto)
        {
            var user = new User
            {
                UserName = dto.UserName,
                Email = dto.Email,
                PasswordHash = dto.Password, //Will have to be hashed later
                DisplayName = dto.DisplayName,
                Bio = dto.Bio,
                AvatarUrl = dto.AvatarUrl
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var readDto = new UserReadDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Bio = user.Bio,
                AvatarUrl = user.AvatarUrl,
                JoinedAt = user.JoinedAt,
                Role = user.Role
            };

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