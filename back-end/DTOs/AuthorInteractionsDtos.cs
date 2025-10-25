using Api.Models;

namespace Api.DTOs
{
    public class AuthorInteractionStatsDto
    {
        public int FollowsCount { get; set; }
        public int FavoritesCount { get; set; }
        public int ReadLatersCount { get; set; }
    }


}
