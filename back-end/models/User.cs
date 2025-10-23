using Microsoft.EntityFrameworkCore;

namespace Api.Models
{
    public enum UserRole
    {
        Admin,
        User
    }
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        public UserRole Role { get; set; } = UserRole.User;

        //Navigation properties
        public ICollection<Novel>? Novels { get; set; }
        public ICollection<Comment>? Comments { get; set; }
        public ICollection<UploadedFile>? UploadedFiles { get; set; }
    }
}
