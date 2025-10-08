using AutoMapper;
using Api.Models;
using Api.DTOs;
using System.Linq;

namespace Api.MappingProfiles
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<Comment, CommentReadDto>()
                .ForMember(dest => dest.Author,
                           opt => opt.MapFrom(src => src.User))
                .ForMember(dest => dest.Replies,
                           opt => opt.MapFrom(src => src.Replies));

            CreateMap<CreateCommentDto, Comment>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Replies, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());

            CreateMap<UpdateCommentDto, Comment>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
