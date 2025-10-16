using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public class Chapter
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;

        public int ChapterNumber { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int Views { get; set; } = 0;

        // Parent Novel
        public int NovelId { get; set; }
        public Novel Novel { get; set; } = null!;

        // Comments
        public ICollection<Comment>? Comments { get; set; } = new List<Comment>();

    }
}
