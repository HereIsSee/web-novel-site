using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.DTOs;
using Api.Models;

public interface INovelStatsService
{
    Task UpdateRatingsAsync(int novelId);
    Task UpdateChaptersAsync(int novelId);
    Task UpdateFollowsAsync(int novelId);
    Task UpdateFavoritesAsync(int novelId);
    Task UpdateReadLatersAsync(int novelId);
    Task IncrementViewAsync(int novelId);
    Task RecalculateAllStatsAsync(int novelId); 
}

public class NovelStatsService : INovelStatsService
{
    private readonly AppDbContext _db;

    public NovelStatsService(AppDbContext db)
    {
        _db = db;
    }

    private async Task<NovelStats> GetOrCreateStats(int novelId)
    {
        var stats = await _db.NovelStats.FindAsync(novelId);
        if (stats == null)
        {
            stats = new NovelStats { Id = novelId };
            _db.NovelStats.Add(stats);
            await _db.SaveChangesAsync();
        }
        return stats;
    }
    
    private void UpdatePopularity(NovelStats stats)
    {
        stats.Popularity =
            (stats.FavoritesCount * 5) +
            (stats.FollowsCount * 4) +
            (stats.ReadLatersCount * 4) +
            (stats.Ratings * 2) +
            (stats.OverallScore * 20) +
            (stats.Views * 0.05);
    }

    public async Task UpdateRatingsAsync(int novelId)
    {
        var stats = await GetOrCreateStats(novelId);

        var reviews = await _db.Reviews
            .Where(r => r.NovelId == novelId)
            .ToListAsync();

        stats.Ratings = reviews.Count;

        stats.OverallScore = reviews.Count > 0 ? reviews.Average(r => r.OverallScore) : 0;
        stats.StoryScore = reviews.Count > 0 ? reviews.Average(r => r.StoryScore) : 0;
        stats.GrammarScore = reviews.Count > 0 ? reviews.Average(r => r.GrammarScore) : 0;
        stats.CharacterScore = reviews.Count > 0 ? reviews.Average(r => r.CharacterScore) : 0;
        stats.StyleScore = reviews.Count > 0 ? reviews.Average(r => r.StyleScore) : 0;

        UpdatePopularity(stats);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateChaptersAsync(int novelId)
    {
        var stats = await GetOrCreateStats(novelId);

        stats.ChaptersCount = await _db.Chapters.CountAsync(c => c.NovelId == novelId);
        stats.WordCount = await _db.Chapters
            .Where(c => c.NovelId == novelId)
            .SumAsync(c => c.WordCount);

        UpdatePopularity(stats);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateFollowsAsync(int novelId)
    {
        var stats = await GetOrCreateStats(novelId);

        stats.FollowsCount = await _db.Follows.CountAsync(f => f.NovelId == novelId);
        
        UpdatePopularity(stats);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateFavoritesAsync(int novelId)
    {
        var stats = await GetOrCreateStats(novelId);

        stats.FavoritesCount = await _db.Favorites.CountAsync(f => f.NovelId == novelId);
        UpdatePopularity(stats);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateReadLatersAsync(int novelId)
    {
        var stats = await GetOrCreateStats(novelId);

        stats.ReadLatersCount = await _db.ReadLaters.CountAsync(r => r.NovelId == novelId);
        UpdatePopularity(stats);
        await _db.SaveChangesAsync();
    }

    public async Task IncrementViewAsync(int novelId)
    {
        var stats = await GetOrCreateStats(novelId);

        stats.Views += 1;
        UpdatePopularity(stats);
        await _db.SaveChangesAsync();
    }

    public async Task RecalculateAllStatsAsync(int novelId)
    {
        var stats = await GetOrCreateStats(novelId);

        var reviews = await _db.Reviews.Where(r => r.NovelId == novelId).ToListAsync();
        stats.Ratings = reviews.Count;
        stats.OverallScore = reviews.Count > 0 ? reviews.Average(r => r.OverallScore) : 0;
        stats.StoryScore = reviews.Count > 0 ? reviews.Average(r => r.StoryScore) : 0;
        stats.GrammarScore = reviews.Count > 0 ? reviews.Average(r => r.GrammarScore) : 0;
        stats.CharacterScore = reviews.Count > 0 ? reviews.Average(r => r.CharacterScore) : 0;
        stats.StyleScore = reviews.Count > 0 ? reviews.Average(r => r.StyleScore) : 0;

        stats.ChaptersCount = await _db.Chapters.CountAsync(c => c.NovelId == novelId);
        stats.WordCount = await _db.Chapters.Where(c => c.NovelId == novelId).SumAsync(c => c.WordCount);

        stats.FollowsCount = await _db.Follows.CountAsync(f => f.NovelId == novelId);
        stats.FavoritesCount = await _db.Favorites.CountAsync(f => f.NovelId == novelId);
        stats.ReadLatersCount = await _db.ReadLaters.CountAsync(r => r.NovelId == novelId);

        UpdatePopularity(stats);
        await _db.SaveChangesAsync();
    }

}
