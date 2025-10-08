using AutoMapper;
using Api.Models;
using Api.DTOs;

namespace Api.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserReadDto>();

            CreateMap<CreateUserDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

            CreateMap<UpdateUserDto, User>();

            CreateMap<User, UserSummaryDto>();
        }
    }
}
