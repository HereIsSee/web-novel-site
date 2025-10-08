using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public class NovelTag
    {
        public Guid NovelId { get; set; }
        public Novel Novel { get; set; } = null!;

        public Guid TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}
