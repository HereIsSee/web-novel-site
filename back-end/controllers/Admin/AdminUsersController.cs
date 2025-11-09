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
        private readonly IUserService _userService;

        public AdminUsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET /api/admin/users?search=john&page=1&pageSize=20&includeDeleted=false
        [HttpGet]
        public async Task<IActionResult> GetUsers(
            string? search = null,
            int page = 1,
            int pageSize = 20,
            bool includeDeleted = false)
        {
            var (users, totalCount) = await _userService.GetUsersAsync(search, page, pageSize, includeDeleted);
            return Ok(new { totalCount, users });
        }

        // GET /api/admin/users/5
        [HttpGet("{userId:int}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            return Ok(user);
        }

        // PUT /api/admin/users/5
        [HttpPut("{userId:int}")]
        public async Task<IActionResult> UpdateUser(int userId, UserUpdateDto dto)
        {
            var updated = await _userService.UpdateUserAsync(userId, dto, isAdmin: true);

            if (!updated) return NotFound("User not found");
            return NoContent();
        }

        // DELETE /api/admin/users/5
        [HttpDelete("{userId:int}")]
        public async Task<IActionResult> SoftDeleteUser(int userId)
        {
            var success = await _userService.SoftDeleteUserAsync(userId);

            if (!success) return BadRequest("User already deleted or not found");
            return NoContent();
        }

        // PATCH /api/admin/users/5/restore
        [HttpPatch("{userId:int}/restore")]
        public async Task<IActionResult> RestoreUser(int userId)
        {
            var success = await _userService.RestoreUserAsync(userId);

            if (!success) return BadRequest("User not deleted or not found");
            return NoContent();
        }

        // PATCH /api/admin/users/5/role?role=Admin
        [HttpPatch("{userId:int}/role")]
        public async Task<IActionResult> ChangeUserRole(int userId, UserRole role)
        {
            var success = await _userService.ChangeUserRoleAsync(userId, role);

            if (!success) return NotFound("User not found");
            return NoContent();
        }

        
    }

}