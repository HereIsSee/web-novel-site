using AutoMapper;
using Api.Models;
using Api.DTOs;

namespace Api.Profiles
{
    public class FollowProfile : Profile
    {
        public FollowProfile()
        {
            CreateMap<Follow, ReadFollowDto>()
                .ForMember(dest => dest.LastReadChapterNumber, opt => opt.Ignore())
                .ForMember(dest => dest.IsFollowing, opt => opt.Ignore());
        }
    }
}
