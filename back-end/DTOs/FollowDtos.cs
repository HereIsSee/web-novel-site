using Api.Models;

namespace Api.DTOs
{
    public class ReadFollowDto
    {
        public int UserId { get; set; }
        public int NovelId { get; set; }
        public int? LastReadChapterId { get; set; }
        public int? LastReadChapterNumber { get; set; }
        public bool IsFollowing { get; set; }
    }
}
