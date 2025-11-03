using Api.Models;

namespace Api.DTOs
{
    public enum OrderBy
    {
        LastUpdate,
        ReleaseDate,
        Followers,
        NumberOfPages,
        Views,
        Title,
        Author,
    }
    public class RangeIntDto
    {
        public int? From { get; set; }
        public int? To { get; set; }
    }

    public class RangeDoubleDto
    {
        public double? From { get; set; }
        public double? To { get; set; }
    }

    public class BasicSearchDto
    {
        public string? Title { get; set; }
    }
    public class AdvancedSearchDto
    {
        public string? Title { get; set; }
        public string? AuthorUsername { get; set; }
        public IEnumerable<int>? TagsIds { get; set; }
        public RangeIntDto? Pages { get; set; }
        public RangeDoubleDto? Raring { get; set; }
        public IEnumerable<NovelStatus>? StatusEnumValues { get; set; }
        public OrderBy OrderBy { get; set; }
        public bool Ascending { get; set; }
    }

}
// {
//   "title": "villain",
//   "authorUsername": "John",
//   "tagsIds": [1, 3, 5],
//   "pages": { "from": 100, "to": 250 },
//   "rating": { "from": 3.5, "to": 5 },
//   "statusEnumValues": [1, 2],
//   "orderBy": "Views",
//   "ascending": false
// }
