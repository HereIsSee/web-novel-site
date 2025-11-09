using Api.DTOs;
using Api.Models;
using Api.Data;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public interface IUserService
{
    Task<(IEnumerable<UserReadDto> users, int totalCount)> GetUsersAsync(
        string? search, int page, int pageSize, bool includeDeleted);

    Task<UserReadDto?> GetUserByIdAsync(int userId);

    Task<UserReadDto> CreateUserAsync(CreateUserDto dto);

    Task<bool> UpdateUserAsync(int userId, UserUpdateDto dto, bool isAdmin);

    Task<bool> SoftDeleteUserAsync(int userId);

    Task<bool> RestoreUserAsync(int userId);

    Task<bool> ChangeUserRoleAsync(int userId, UserRole role);

    Task<string> EmailOrUserNameAlreadyUsed(string email, string userName, int? userId = null);
}

public class UserService : IUserService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public UserService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<(IEnumerable<UserReadDto> users, int totalCount)> GetUsersAsync(
        string? search, int page, int pageSize, bool includeDeleted)
    {
        var query = _db.Users.AsQueryable();

        if (!includeDeleted)
            query = query.Where(u => !u.IsDeleted);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(u => u.UserName.Contains(search) || u.Email.Contains(search));

        var totalCount = await query.CountAsync();

        var users = await query
            .OrderBy(u => u.UserName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (_mapper.Map<IEnumerable<UserReadDto>>(users), totalCount);
    }

    public async Task<UserReadDto?> GetUserByIdAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        return user == null ? null : _mapper.Map<UserReadDto>(user);
    }

    public async Task<UserReadDto> CreateUserAsync(CreateUserDto dto)
    {
        var user = _mapper.Map<User>(dto);
        var hasher = new PasswordHasher<User>();
        user.PasswordHash = hasher.HashPassword(user, dto.Password);
        user.JoinedAt = DateTime.UtcNow;

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return _mapper.Map<UserReadDto>(user);
    }

    public async Task<bool> UpdateUserAsync(int userId, UserUpdateDto dto, bool isAdmin)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return false;

        // Admin can update any field; user can modify restricted
        _mapper.Map(dto, user);

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SoftDeleteUserAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null || user.IsDeleted) return false;

        user.IsDeleted = true;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RestoreUserAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null || !user.IsDeleted) return false;

        user.IsDeleted = false;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ChangeUserRoleAsync(int userId, UserRole role)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return false;

        user.Role = role;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<string> EmailOrUserNameAlreadyUsed(string email, string userName, int? userId = null)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => (u.Email == email || u.UserName == userName) && (userId == null || u.Id != userId));

        if (user == null) return "";

        if (user.Email == email && user.UserName == userName)
            return "Email and Username already used";
        else if (user.Email == email)
            return "Email already used";
        else
            return "UserName already used";
    }
}