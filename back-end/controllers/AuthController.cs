using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IMapper mapper, IConfiguration config)
        {
            _db = db;
            _mapper = mapper;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin userLogin)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == userLogin.Email);
            if (user == null) return Unauthorized(new { message = "Email not found" });

            var hasher = new PasswordHasher<User>();

            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, userLogin.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Wrong password" });

            var token = GenerateJwtToken(user.Id, user.UserName);

            return Ok(new { token });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserReadDto>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token.");

            if (!int.TryParse(userIdClaim, out int userId))
                return BadRequest("Invalid user ID in token.");

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            var dto = _mapper.Map<UserReadDto>(user);
            return Ok(dto);
    }

        private string GenerateJwtToken(int userId, string username)
        {
            var jwtKey = _config["Jwt:Key"];
            var jwtIssuer = _config["Jwt:Issuer"];
            
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtIssuer,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }

}