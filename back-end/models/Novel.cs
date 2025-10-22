using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public enum NovelStatus
    {
        Draft,
        Published,
        Hidden
    }
    public class Novel
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public string? Synopsis { get; set; }
        // One-to-one relationship
        public UploadedFile? CoverImage { get; set; }
        public string? CoverImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int Views { get; set; } = 0;

        public NovelStatus Status { get; set; } = NovelStatus.Draft;

        // Author (User)
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Relationships
        public ICollection<Chapter>? Chapters { get; set; } = new List<Chapter>();
        public ICollection<Comment>? Comments { get; set; } = new List<Comment>();

        public ICollection<NovelTag> NovelTags { get; set; } = new List<NovelTag>();
    }
}
