using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using AutoMapper.QueryableExtensions;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;


namespace Api.Controllers
{
    [ApiController]
    [Route("api/admin/announcements")]
    public class AdminAnnouncements : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;
        private readonly INovelRankingService _rankingService;

        public AdminAnnouncements(IWebHostEnvironment env, AppDbContext db, IMapper mapper, INovelStatsService statsService, INovelRankingService rankingService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
            _rankingService = rankingService;
        }

        // GET	    /api/admin/announcements	                Get list of announcements
        // GET  	/api/admin/announcements/{id}	            Get single announcement
        // POST	    /api/admin/announcements	                Create announcement
        // PUT	    /api/admin/announcements/{id}	            Update announcement
        // DELETE	/api/admin/announcements/{id}	        Delete announcement
        // PATCH	/api/admin/announcements/{id}/toggle    Activate/Deactivate announcement




    }

}