using Api.Models;

public class UploadedFile
{
    public int Id { get; set; }
    public int? NovelId { get; set; }
    public Novel? Novel { get; set; } = null!;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string FileName { get; set; } = null!; // e.g. "guid.jpg"
    public string FileUrl { get; set; } = null!; // public URL (/uploads/... or cloud URL)
    public string FilePath { get; set; } = null!; // physical path for deletion
    public bool IsTemporary { get; set; } = true;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; } // set for temp files
}
