using Api.Models;
using System;
using System.Collections.Generic;

namespace Api.DTOs
{
    public class ChapterReadDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public int ChapterNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int Views { get; set; }
    }

    public class CreateChapterDto
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public int ChapterNumber { get; set; }
    }

    public class UpdateChapterDto
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? ChapterNumber { get; set; }
    }
}
