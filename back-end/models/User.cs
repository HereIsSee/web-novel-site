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
        
        // Soft-delete for when admin deletes a user
        public bool IsDeleted { get; set; } = false;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpires { get; set; }

        //Navigation properties
        public ICollection<Novel>? Novels { get; set; }
        public ICollection<Comment>? Comments { get; set; }
        public ICollection<UploadedFile>? UploadedFiles { get; set; }
        public ICollection<Follow>? Follows { get; set; }
        public ICollection<Favorite>? Favorites { get; set; }
        public ICollection<ReadLater>? ReadLaters { get; set; }
        public ICollection<Review>? Reviews { get; set; }
    }
}
