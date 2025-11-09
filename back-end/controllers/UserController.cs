using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : BaseController
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
        public async Task<ActionResult<UserReadDto>> GetUser(int id)
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
            var used = await EmailOrUserNameAlreadyUsed(dto.Email, dto.UserName);

            if (used != "")
                return Conflict(new { message = used });

            var user = _mapper.Map<User>(dto);

            var hasher = new PasswordHasher<User>();
            user.PasswordHash = hasher.HashPassword(user, dto.Password);

            user.JoinedAt = DateTime.UtcNow;

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var readDto = _mapper.Map<UserReadDto>(user);

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, readDto);
        }
        
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto updatedUser)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });
            if (userId != id)
                return BadRequest(new { message = "Only the user can update his information" });

            var used = "";
            if (updatedUser.Email != null && updatedUser.UserName != null)
                used = await EmailOrUserNameAlreadyUsed(updatedUser.Email, updatedUser.UserName, userId);
            else if (updatedUser.Email != null)
                used = await EmailAlreadyUsed(updatedUser.Email, userId);
            else if (updatedUser.UserName != null)
                used = await UserNameAlreadyUsed(updatedUser.UserName, userId);
            
            if (used != "")
                return Conflict(new { message = used });

            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _mapper.Map(updatedUser, user);

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        private async Task<string> EmailOrUserNameAlreadyUsed(string email, string userName, int? userId = null)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => (u.Email == email || u.UserName == userName) && (userId == null || u.Id != userId));
            if (user == null)
                return "";

            if (user.Email == email && user.UserName == userName)
                return "Email and Username already used";
            else if (user.Email == email)
                return "Email already used";
            else
                return "UserName already used";
        }
        private async Task<string> EmailAlreadyUsed(string email, int? userId = null)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => (u.Email == email) && (userId == null || u.Id != userId));
            if (user == null)
                return "";
            
            return "Email already used";
        }
        private async Task<string> UserNameAlreadyUsed(string userName, int? userId = null)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => (u.UserName == userName) && (userId == null || u.Id != userId));
            if (user == null)
                return "";

            return "UserName already used";
        }
    }

}