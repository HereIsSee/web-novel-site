using AutoMapper;
using Api.Models;
using Api.DTOs;

namespace Api.Profiles
{
    public class NovelStatsProfile : Profile
    {
        public NovelStatsProfile()
        {
            CreateMap<NovelStats, NovelStatsDto>();
            CreateMap<NovelStatsDto, NovelStats>();
        }
    }
}
