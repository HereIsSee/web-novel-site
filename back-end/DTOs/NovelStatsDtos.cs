using Api.Models;

namespace Api.DTOs
{
    public class NovelStatsDto
    {
        public double OverallScore { get; set; }
        public double StyleScore { get; set; }
        public double StoryScore { get; set; }
        public double GrammarScore { get; set; }
        public double CharacterScore { get; set; }
        public int FollowsCount { get; set; }
        public int FavoritesCount { get; set; }
        public int ReadLatersCount { get; set; }
        public int ChaptersCount { get; set; }
        public int Views { get; set; }
        public int Ratings { get; set; }
    }

}
