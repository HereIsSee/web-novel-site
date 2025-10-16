using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public class Comment
    {
        public int Id { get; set; }

        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        [NotMapped]
        public bool IsEdited => UpdatedAt.HasValue;

        // Relationships
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int? NovelId { get; set; }
        public Novel? Novel { get; set; }

        public int? ChapterId { get; set; }
        public Chapter? Chapter { get; set; }

        // For replies (self-referencing relationship)
        public int? ParentCommentId { get; set; }
        public Comment? ParentComment { get; set; }
        public ICollection<Comment>? Replies { get; set; } = new List<Comment>();

    }
}
