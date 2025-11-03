using Api.DTOs;

public interface INovelRankingService
{
    double CalculatePopularity(NovelStatsDto stats);
    List<(int NovelId, double Score)> RankNovels(Dictionary<int, NovelStatsDto> stats);
}

public class NovelRankingService : INovelRankingService
{
    public double CalculatePopularity(NovelStatsDto stats)
    {
        if (stats == null) return 0;

        return (stats.FavoritesCount * 5)
             + (stats.FollowsCount * 4)
             + (stats.ReadLatersCount * 4)
             + (stats.Ratings * 2)
             + (stats.OverallScore * 20)
             + (stats.Views * 0.1);
    }

    public List<(int NovelId, double Score)> RankNovels(Dictionary<int, NovelStatsDto> stats)
    {
        return stats
            .Select(s => (s.Key, CalculatePopularity(s.Value)))
            .OrderByDescending(x => x.Item2)
            .ToList();
    }
}
