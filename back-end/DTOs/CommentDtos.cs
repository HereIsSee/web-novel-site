using Api.Models;

namespace Api.DTOs
{
    public class CreateCommentDto
    {
        public string Content { get; set; } = null!;
        public int UserId { get; set; }
        public int? NovelId { get; set; }
        public int? ChapterId { get; set; }
        public int? ParentCommentId { get; set; }
    }

    public class UpdateCommentDto
    {
        public string? Content { get; set; } = null!;
    }

    public class CommentReadDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsEdited => UpdatedAt.HasValue;

        public UserSummaryDto Author { get; set; } = null!;
        public List<CommentReadDto> Replies { get; set; } = new List<CommentReadDto>();
    }
}
