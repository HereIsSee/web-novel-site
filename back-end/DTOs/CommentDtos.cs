using Api.Models;

namespace Api.DTOs
{
    public class CreateCommentDto
    {
        public string Content { get; set; } = null!;
        public Guid UserId { get; set; }
        public Guid? NovelId { get; set; }
        public Guid? ChapterId { get; set; }
        public Guid? ParentCommentId { get; set; }
    }

    public class UpdateCommentDto
    {
        public string? Content { get; set; } = null!;
    }

    public class CommentReadDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsEdited => UpdatedAt.HasValue;

        public UserSummaryDto Author { get; set; } = null!;
        public List<CommentReadDto> Replies { get; set; } = new List<CommentReadDto>();
    }
}
