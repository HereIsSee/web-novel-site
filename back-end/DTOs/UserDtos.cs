using Api.Models;

namespace Api.DTOs
{
    public class CreateUserDto
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!; // raw password, to be hashed in service
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
    }

    public class UpdateUserDto
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
    }

    public class UserReadDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime JoinedAt { get; set; }
        public UserRole Role { get; set; }
    }

    public class UserSummaryDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
