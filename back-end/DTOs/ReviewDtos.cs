using Api.Models;

namespace Api.DTOs
{
    public class CreateReviewDto
    {
        public string Title { get; set; } = null!;
        public double OverallScore { get; set; }
        public double StyleScore { get; set; }
        public double StoryScore { get; set; }
        public double GrammarScore { get; set; }
        public double CharacterScore { get; set; }
        public string ReviewContent { get; set; } = null!;
        
    }
    public class UpdateReviewDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public double? OverallScore { get; set; }
        public double? StyleScore { get; set; }
        public double? StoryScore { get; set; }
        public double? GrammarScore { get; set; }
        public double? CharacterScore { get; set; }
        public string? ReviewContent { get; set; } = null!;
    }

    public class ReadReviewDto
    {
        public string Title { get; set; } = null!;
        public double OverallScore { get; set; }
        public double StyleScore { get; set; }
        public double StoryScore { get; set; }
        public double GrammarScore { get; set; }
        public double CharacterScore { get; set; }
        public string ReviewContent { get; set; } = null!;
        public UserSummaryDto Author { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
