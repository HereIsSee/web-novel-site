using Api.Models;

namespace Api.DTOs
{

    public class TagReadDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
