using Api.Models;

namespace Api.DTOs
{
    public class CreateNovelDto
    {
        public string Title { get; set; } = null!;
        public string? Synopsis { get; set; }
        public int? CoverImageId { get; set; }
        public NovelStatus Status { get; set; } = NovelStatus.Draft;
        public IEnumerable<TagDto> Tags { get; set; } = [];
    }

    public class UpdateNovelDto
    {
        public string? Title { get; set; }
        public string? Synopsis { get; set; }
        public string? CoverImageUrl { get; set; }
        public NovelStatus? Status { get; set; }
    }

    public class NovelReadDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Synopsis { get; set; }
        public string? CoverImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int Views { get; set; }
        public NovelStatus Status { get; set; }

        // Simple author info
        public UserSummaryDto Author { get; set; } = null!;

        // Tags (flat list)
        public List<TagDto> Tags { get; set; } = new();
    }
}
