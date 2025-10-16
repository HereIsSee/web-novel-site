using Api.Models;
using System.ComponentModel.DataAnnotations;

namespace Api.DTOs
{
    public class CreateUserDto
    {
        [Required]
        public string UserName { get; set; } = null!;
        [Required]
        public string Email { get; set; } = null!;
        [Required]
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
        public int Id { get; set; }
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
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
