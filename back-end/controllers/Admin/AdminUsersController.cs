using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using AutoMapper.QueryableExtensions;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;


namespace Api.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;
        private readonly INovelRankingService _rankingService;

        public AdminUsersController(IWebHostEnvironment env, AppDbContext db, IMapper mapper, INovelStatsService statsService, INovelRankingService rankingService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
            _rankingService = rankingService;
        }

        // GET	/api/admin/users?search=john&page=1&pageSize=20&includeDeleted=false
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserReadDto>>> GetUsers(
            string? search = null,
            int page = 1,
            int pageSize = 20,
            bool includeDeleted = false)
        {
            var query = _db.Users.AsQueryable();

            if (!includeDeleted)
                query = query.Where(u => !u.IsDeleted);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(u => u.UserName.Contains(search) || u.Email.Contains(search));

            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = _mapper.Map<IEnumerable<UserReadDto>>(users);
            return Ok(userDtos);
        }

        // GET	/api/admin/users/{userId}
        [HttpGet("{userId:int}")]
        public async Task<ActionResult<UserReadDto>> GetUserById(int userId)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            return Ok(_mapper.Map<UserReadDto>(user));
        }

        // PUT	/api/admin/users/{userId}
        [HttpPut("{userId:int}")]
        public async Task<ActionResult> UpdateUser(int userId, UserUpdateDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            user.UserName = dto.UserName;
            user.Bio = dto.Bio;
            user.Email = dto.Email;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE	/api/admin/users/{userId} (Soft Delete)
        [HttpDelete("{userId:int}")]
        public async Task<ActionResult> SoftDeleteUser(int userId)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            if (user.IsDeleted)
                return BadRequest("User is already deleted");

            user.IsDeleted = true;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // PATCH	/api/admin/users/{userId}/restore
        [HttpPatch("{userId:int}/restore")]
        public async Task<ActionResult> RestoreUser(int userId)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            if (!user.IsDeleted)
                return BadRequest("User is not deleted");

            user.IsDeleted = false;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // PATCH	/api/admin/users/{userId}/role?role=Admin
        [HttpPatch("{userId:int}/role")]
        public async Task<ActionResult> ChangeUserRole(int userId, UserRole role)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            user.Role = role;
            await _db.SaveChangesAsync();
            return NoContent();
        }
        
    }

}