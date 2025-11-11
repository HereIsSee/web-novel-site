using Api.Models;

namespace Api.DTOs
{
    public class CreateNovelDto
    {
        public string Title { get; set; } = null!;
        public string? Synopsis { get; set; }
        public int? CoverImageId { get; set; }
        // public NovelStatus Status { get; set; } = NovelStatus.Draft;
        public IEnumerable<TagDto> Tags { get; set; } = null!;
    }

    public class UpdateNovelDto
    {
        public string? Title { get; set; } = null!;
        public string? Synopsis { get; set; }
        public int? CoverImageId { get; set; }
        public NovelStatus? Status { get; set; }
        public IEnumerable<TagDto>? Tags { get; set; } = [];
    }

    public class NovelReadDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Synopsis { get; set; }
        public string? CoverImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        // public int Views { get; set; }
        public NovelStatus Status { get; set; }

        // Simple author info
        public UserSummaryDto Author { get; set; } = null!;

        // Tags (flat list)
        public List<TagDto> Tags { get; set; } = new();
        public NovelStatsDto Stats { get; set; } = null!;
    }

    public class NovelFollowDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? CoverImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public NovelStatus Status { get; set; }
        // Simple author info
        public UserSummaryDto Author { get; set; } = null!;

        public ChapterListItemDto? LatestChapter { get; set; }
        public ChapterListItemDto? LastReadChapter { get; set; }
        public ChapterListItemDto? NextChapter { get; set; }
    }

    public class NovelWithChaptersDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? CoverImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public NovelStatus Status { get; set; }
        public UserSummaryDto Author { get; set; } = null!;
        public List<ChapterListItemDto> Chapters { get; set; } = [];
    }

    public class NovelSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? CoverImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public NovelStatus Status { get; set; }
    }
}
