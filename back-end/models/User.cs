using Microsoft.EntityFrameworkCore;

namespace Api.Models
{
    public enum UserRole
    {
        Reader,
        Author,
        Admin
    }
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        public UserRole Role { get; set; } = UserRole.Reader;

        //Navigation properties
        public ICollection<Novel>? Novels { get; set; }
        public ICollection<Comment>? Comments { get; set; }
        public ICollection<UploadedFile>? UploadedFiles { get; set; }
    }
}
