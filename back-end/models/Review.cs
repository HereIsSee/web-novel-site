using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public class Review
    {
        public string Title { get; set; } = null!;
        public double OverallScore { get; set; }
        public double StyleScore { get; set; }
        public double StoryScore { get; set; }
        public double GrammarScore { get; set; }
        public double CharacterScore { get; set; }
        public string ReviewContent { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int NovelId { get; set; }
        public Novel Novel { get; set; } = null!;
        
    }
}
