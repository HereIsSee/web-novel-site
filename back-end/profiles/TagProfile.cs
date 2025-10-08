using AutoMapper;
using Api.Models;
using Api.DTOs;

namespace Api.Profiles
{
    public class TagProfile : Profile
    {
        public TagProfile()
        {
            CreateMap<Tag, TagReadDto>();
        }
    }
}
