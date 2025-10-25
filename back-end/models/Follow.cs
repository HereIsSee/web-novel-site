using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public class Follow
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int NovelId { get; set; }
        public Novel Novel { get; set; } = null!;
    }
}
