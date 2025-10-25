using Api.Models;

namespace Api.DTOs
{
    public class NovelStatsDto
    {
        public int FollowsCount { get; set; }
        public int FavoritesCount { get; set; }
        public int ReadLatersCount { get; set; }
        public int Views { get; set; }
    }

}
