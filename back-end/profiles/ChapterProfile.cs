using AutoMapper;
using Api.Models;
using Api.DTOs;

namespace Api.MappingProfiles
{
    public class ChapterProfile : Profile
    {
        public ChapterProfile()
        {
            CreateMap<Chapter, ChapterReadDto>();

            CreateMap<CreateChapterDto, Chapter>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Views, opt => opt.Ignore());

            CreateMap<UpdateChapterDto, Chapter>()
                .ForAllMembers(opt => 
                    opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
