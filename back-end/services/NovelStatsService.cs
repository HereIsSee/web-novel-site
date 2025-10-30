using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.DTOs;

public interface INovelStatsService
{
    Task<NovelStatsDto?> GetNovelStatsAsync(int novelId);
    Task<Dictionary<int, NovelStatsDto>> GetStatsForNovelsAsync(List<int> novelIds);
}

public class NovelStatsService : INovelStatsService
{
    private readonly AppDbContext _db;

    public NovelStatsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<NovelStatsDto?> GetNovelStatsAsync(int novelId)
    {
        var novel = await _db.Novels.FindAsync(novelId);
        if (novel == null)
            return null;

        var reviewStats = await _db.Reviews
            .Where(r => r.NovelId == novelId)
            .GroupBy(r => r.NovelId)
            .Select(g => new
            {
                OverallScore = g.Average(r => r.OverallScore),
                StyleScore = g.Average(r => r.StyleScore),
                StoryScore = g.Average(r => r.StoryScore),
                GrammarScore = g.Average(r => r.GrammarScore),
                CharacterScore = g.Average(r => r.CharacterScore),
                Ratings = g.Count()
            })
            .FirstOrDefaultAsync();

        return new NovelStatsDto
        {
            OverallScore = reviewStats?.OverallScore ?? 0,
            StyleScore = reviewStats?.StyleScore ?? 0,
            StoryScore = reviewStats?.StoryScore ?? 0,
            GrammarScore = reviewStats?.GrammarScore ?? 0,
            CharacterScore = reviewStats?.CharacterScore ?? 0,
            FollowsCount = await _db.Follows.CountAsync(f => f.NovelId == novelId),
            FavoritesCount = await _db.Favorites.CountAsync(f => f.NovelId == novelId),
            ReadLatersCount = await _db.ReadLaters.CountAsync(r => r.NovelId == novelId),
            ChaptersCount = await _db.Chapters.CountAsync(c => c.NovelId == novelId),
            Views = novel.Views,
            Ratings = reviewStats?.Ratings ?? 0
        };
    }

    public async Task<Dictionary<int, NovelStatsDto>> GetStatsForNovelsAsync(List<int> novelIds)
    {
        if (novelIds == null || novelIds.Count == 0)
            return new Dictionary<int, NovelStatsDto>();

        // Bulk fetch reviews
        var reviewStats = await _db.Reviews
            .Where(r => novelIds.Contains(r.NovelId))
            .GroupBy(r => r.NovelId)
            .Select(g => new
            {
                NovelId = g.Key,
                OverallScore = g.Average(r => r.OverallScore),
                StyleScore = g.Average(r => r.StyleScore),
                StoryScore = g.Average(r => r.StoryScore),
                GrammarScore = g.Average(r => r.GrammarScore),
                CharacterScore = g.Average(r => r.CharacterScore),
                Ratings = g.Count()
            })
            .ToDictionaryAsync(x => x.NovelId);

        // Bulk fetch follows
        var follows = await _db.Follows
            .Where(f => novelIds.Contains(f.NovelId))
            .GroupBy(f => f.NovelId)
            .Select(g => new { NovelId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.NovelId);

        // Bulk fetch favorites
        var favorites = await _db.Favorites
            .Where(f => novelIds.Contains(f.NovelId))
            .GroupBy(f => f.NovelId)
            .Select(g => new { NovelId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.NovelId);

        // Bulk fetch read-laters
        var readLaters = await _db.ReadLaters
            .Where(r => novelIds.Contains(r.NovelId))
            .GroupBy(r => r.NovelId)
            .Select(g => new { NovelId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.NovelId);

        // Bulk fetch read-laters
        var chaptersCount = await _db.Chapters
            .Where(c => novelIds.Contains(c.NovelId))
            .GroupBy(c => c.NovelId)
            .Select(g => new { NovelId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.NovelId);
        
        // Load novels (for views)
        var novels = await _db.Novels
            .Where(n => novelIds.Contains(n.Id))
            .ToDictionaryAsync(n => n.Id);

        var result = new Dictionary<int, NovelStatsDto>();

        foreach (var id in novelIds)
        {
            reviewStats.TryGetValue(id, out var rs);
            follows.TryGetValue(id, out var f);
            favorites.TryGetValue(id, out var fav);
            readLaters.TryGetValue(id, out var rl);
            novels.TryGetValue(id, out var novel);
            chaptersCount.TryGetValue(id, out var ch);

            result[id] = new NovelStatsDto
            {
                OverallScore = rs?.OverallScore ?? 0,
                StyleScore = rs?.StyleScore ?? 0,
                StoryScore = rs?.StoryScore ?? 0,
                GrammarScore = rs?.GrammarScore ?? 0,
                CharacterScore = rs?.CharacterScore ?? 0,
                Ratings = rs?.Ratings ?? 0,
                FollowsCount = f?.Count ?? 0,
                FavoritesCount = fav?.Count ?? 0,
                ReadLatersCount = rl?.Count ?? 0,
                ChaptersCount = ch?.Count ?? 0,
                Views = novel?.Views ?? 0
            };
        }

        return result;
    }
}
