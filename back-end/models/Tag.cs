using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public class Tag
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; } = null!;

        // Many-to-many relationship
        public ICollection<NovelTag>? NovelTags { get; set; } = new List<NovelTag>();
    }
}
