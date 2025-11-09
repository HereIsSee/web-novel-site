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
    [Route("api/admin/chapters")]
    public class AdminChaptersController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;
        private readonly INovelRankingService _rankingService;

        public AdminChaptersController(IWebHostEnvironment env, AppDbContext db, IMapper mapper,INovelStatsService statsService, INovelRankingService rankingService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
            _rankingService = rankingService;
        }


        // GET	    /api/admin/novels/{novelId}/chapters	List chapters for a novel
        // GET  	/api/admin/chapters/{chapterId}	        Get chapter details
        // PUT	    /api/admin/chapters/{chapterId}	        Edit chapter title or content
        // DELETE	/api/admin/chapters/{chapterId}	        Hard delete a chapter

        
    }

}