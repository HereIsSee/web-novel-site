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
    [Route("api/admin/novels")]
    public class AdminNovelsController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        private readonly INovelStatsService _statsService;
        private readonly INovelRankingService _rankingService;

        public AdminNovelsController(IWebHostEnvironment env, AppDbContext db, IMapper mapper,INovelStatsService statsService, INovelRankingService rankingService)
        {
            _db = db;
            _mapper = mapper;
            _env = env;
            _statsService = statsService;
            _rankingService = rankingService;
        }


        // GET	    /api/admin/novels	                Paginated list of novels (with filters)
        // GET  	/api/admin/novels/{novelId} 	    Get full novel details
        // PUT	    /api/admin/novels/{novelId}	        Edit novel metadata (title, synopsis, tags, genre, cover, status)
        // PATCH	/api/admin/novels/{novelId}/hide	Soft-hide the novel (IsDeleted = true)
        // PATCH	/api/admin/novels/{novelId}/restore	Restore a hidden/deleted novel
        // DELETE	/api/admin/novels/{novelId}	        Hard delete novel (rare, irreversible)

        
    }

}