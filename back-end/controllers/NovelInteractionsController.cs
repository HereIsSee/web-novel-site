using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NovelInteractionsController : BaseController
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly INovelStatsService _statsService;

        public NovelInteractionsController(AppDbContext db, IMapper mapper, INovelStatsService statsService)
        {
            _db = db;
            _mapper = mapper;
            _statsService = statsService;
        }

        [Authorize]
        [HttpPost("follow/{novelId}")]
        public async Task<IActionResult> FollowNovel(int novelId)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null)
                return NotFound(new { message = "Novel not found." });

            var existingFollow = await _db.Follows
                .FirstOrDefaultAsync(f => f.UserId == userId && f.NovelId == novelId);
            if (existingFollow != null)
                return Ok(new { message = "You are already following this novel." });

            var follow = new Follow
            {
                UserId = userId.Value,
                NovelId = novelId
            };

            _db.Follows.Add(follow);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Novel followed successfully." });
        }

        [Authorize]
        [HttpDelete("follow/{novelId}")]
        public async Task<IActionResult> UnfollowNovel(int novelId)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var follow = await _db.Follows
                .FirstOrDefaultAsync(f => f.UserId == userId && f.NovelId == novelId);

            if (follow == null)
                return Ok(new { message = "You are not following this novel." });

            _db.Follows.Remove(follow);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Unfollowed the novel successfully." });
        }

        [HttpGet("follow/{novelId}/user/{userId}")]
        public async Task<ActionResult<ReadFollowDto>> GetFollow(int novelId, int userId)
        {
            var followDto = await _db.Follows
                .Where(f => f.UserId == userId && f.NovelId == novelId)
                .Select(f => new ReadFollowDto
                {
                    NovelId = f.NovelId,
                    UserId = f.UserId,
                    LastReadChapterId = f.LastReadChapterId,
                    LastReadChapterNumber = f.LastReadChapterId != null
                        ? _db.Chapters
                            .Where(c => c.Id == f.LastReadChapterId)
                            .Select(c => c.ChapterNumber)
                            .FirstOrDefault()
                        : null,
                    IsFollowing = true
                })
                .FirstOrDefaultAsync();

            if (followDto == null)
                return Ok(new ReadFollowDto { NovelId = novelId, UserId = userId, IsFollowing = false });

            return Ok(followDto);
        }

        
        [Authorize]
        [HttpPost("favorite/{novelId}")]
        public async Task<IActionResult> UserFavoriteNovel(int novelId)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null)
                return NotFound(new { message = "Novel not found." });

            var existingFavorite = await _db.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.NovelId == novelId);
            if (existingFavorite != null)
                return Ok(new { message = "You have already favorited this novel." });

            var favorite = new Favorite
            {
                UserId = userId.Value,
                NovelId = novelId
            };

            _db.Favorites.Add(favorite);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Novel followed successfully." });
        }

        [Authorize]
        [HttpDelete("favorite/{novelId}")]
        public async Task<IActionResult> UnfavoriteNovel(int novelId)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var favorite = await _db.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.NovelId == novelId);

            if (favorite == null)
                return Ok(new { message = "You have not favorited this novel." });

            _db.Favorites.Remove(favorite);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Unfavorited the novel successfully." });
        }
        
        [Authorize]
        [HttpGet("favorite/{novelId}")]
        public async Task<ActionResult<bool>> IsFavoriteNovel(int novelId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            bool IsFavoriteNovel = await _db.Favorites
                .AnyAsync(f => f.UserId == userId && f.NovelId == novelId);

            return Ok(IsFavoriteNovel);
        }


        [Authorize]
        [HttpPost("readlater/{novelId}")]
        public async Task<IActionResult> UserReadLatereNovel(int novelId)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null)
                return NotFound(new { message = "Novel not found." });

            var existingReadLater = await _db.ReadLaters
                .FirstOrDefaultAsync(rd => rd.UserId == userId && rd.NovelId == novelId);
            if (existingReadLater != null)
                return Ok(new { message = "You have already marked this novel as read later." });

            var readLater = new ReadLater
            {
                UserId = userId.Value,
                NovelId = novelId
            };

            _db.ReadLaters.Add(readLater);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Novel marked as read later successfully." });
        }

        [Authorize]
        [HttpDelete("readlater/{novelId}")]
        public async Task<IActionResult> UnReadLaterNovel(int novelId)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var readLater = await _db.ReadLaters
                .FirstOrDefaultAsync(rd => rd.UserId == userId && rd.NovelId == novelId);

            if (readLater == null)
                return Ok(new { message = "You have not not marked this novel as read later." });

            _db.ReadLaters.Remove(readLater);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Novel unmarked as read later successfully." });
        }

        [Authorize]
        [HttpGet("readlater/{novelId}")]
        public async Task<ActionResult<bool>> IsReadLaterNovel(int novelId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            bool IsReadLaterNovel = await _db.ReadLaters
                .AnyAsync(rd => rd.UserId == userId && rd.NovelId == novelId);

            return Ok(IsReadLaterNovel);
        }

        [Authorize]
        [HttpGet("status/{novelId}")]
        public async Task<IActionResult> GetUserNovelStatus(int novelId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var isFollowed = await _db.Follows.AnyAsync(f => f.UserId == userId && f.NovelId == novelId);
            var isFavorited = await _db.Favorites.AnyAsync(f => f.UserId == userId && f.NovelId == novelId);
            var isReadLater = await _db.ReadLaters.AnyAsync(r => r.UserId == userId && r.NovelId == novelId);

            return Ok(new
            {
                isFollowed,
                isFavorited,
                isReadLater
            });
        }

        [HttpGet("stats/novel/{novelId}")]
        public async Task<ActionResult<NovelStatsDto>> GetNovelStats(int novelId)
        {
            var stats = await _statsService.GetNovelStatsAsync(novelId);
            if (stats == null)
                return NotFound(new { message = "Novel not found" });

            return Ok(stats);
        }


        [HttpGet("stats/author/{authorId}")]
        public async Task<ActionResult<AuthorInteractionStatsDto>> GetAuthorNovelStats(int authorId)
        {
            var authorExists = await _db.Users.AnyAsync(u => u.Id == authorId);
            if (!authorExists)
                return NotFound(new { message = "Author not found" });

            var novelIds = await _db.Novels
                .Where(n => n.UserId == authorId)
                .Select(n => n.Id)
                .ToListAsync();

            var stats = new AuthorInteractionStatsDto
            {
                FollowsCount = await _db.Follows.CountAsync(f => novelIds.Contains(f.NovelId)),
                FavoritesCount = await _db.Favorites.CountAsync(f => novelIds.Contains(f.NovelId)),
                ReadLatersCount = await _db.ReadLaters.CountAsync(r => novelIds.Contains(r.NovelId))
            };

            return Ok(stats);
        }

        [HttpPost("view/{novelId}")]
        public async Task<IActionResult> IncrementView(int novelId)
        {
            var novel = await _db.Novels.FindAsync(novelId);
            if (novel == null) return NotFound();

            novel.Views += 1;
            await _db.SaveChangesAsync();

            return Ok(new { views = novel.Views });
        }
        [HttpPost("follow/{novelId}/last-read/{chapterId}")]
        public async Task<IActionResult> UpdateFollowLastReadChapter(int novelId, int chapterId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Invalid or missing user Id." });

            var follow = await _db.Follows
                .FirstOrDefaultAsync(f => f.UserId == userId && f.NovelId == novelId);

            if (follow == null)
                return NotFound(new { message = "You are not following this novel." });

            var chapter = await _db.Chapters
                .FirstOrDefaultAsync(c => c.Id == chapterId && c.NovelId == novelId);

            if (chapter == null)
                return BadRequest(new { message = "Invalid chapter for this novel." });

            follow.LastReadChapterId = chapterId;
            follow.LastReadChapter = chapter;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Last read chapter updated successfully." });
        }

    }

}