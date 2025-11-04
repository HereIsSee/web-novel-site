using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public class NovelStats
    {
        [ForeignKey(nameof(Novel))]
        public int Id { get; set; }
        public double OverallScore { get; set; } = 0;
        public double StyleScore { get; set; } = 0;
        public double StoryScore { get; set; } = 0;
        public double GrammarScore { get; set; } = 0;
        public double CharacterScore { get; set; } = 0;
        public int FollowsCount { get; set; } = 0;
        public int FavoritesCount { get; set; } = 0;
        public int ReadLatersCount { get; set; } = 0;
        public int ChaptersCount { get; set; } = 0;
        public int Views { get; set; } = 0;
        public int Ratings { get; set; } = 0;
        public int WordCount { get; set; } = 0;
        public double Popularity { get; set; } = 0;

        public Novel Novel { get; set; } = null!;
    }
}
