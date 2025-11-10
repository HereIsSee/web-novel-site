// using Api.DTOs;
// using Api.Models;
// using Api.Data;
// using AutoMapper;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;

// public interface INovelService
// {
//     Task<NovelReadDto?> GetNovelsAsync();
//     Task<NovelReadDto?> GetNovelByIdAsync(int novelId);
//     Task<NovelReadDto?> UpdateNovelAsync(int novelId, UpdateNovelDto dto);
//     Task<NovelReadDto?> SoftDeleteNovelAsync(int novelId);
//     Task<NovelReadDto?> RestoreNovelAsync(int novelId);
// }

// public class NovelService : INovelService
// {
//     private readonly AppDbContext _db;
//     private readonly IMapper _mapper;

//     public NovelService(AppDbContext db, IMapper mapper)
//     {
//         _db = db;
//         _mapper = mapper;
//     }

//     public async Task<(IEnumerable<NovelReadDto> users, int totalCount)> GetNovelsAsync(
//         int page, int pageSize, bool includeDeleted)
//     {
//         var query = _db.Novels.AsQueryable();

//         if (!includeDeleted)
//             query = query.Where(n => !n.IsDeleted);

//         var totalCount = await query.CountAsync();

//         var novels = await query
//             .OrderBy(u => u.Title)
//             .Skip((page - 1) * pageSize)
//             .Take(pageSize)
//             .ToListAsync();

//         return (_mapper.Map<IEnumerable<NovelReadDto>>(novels), totalCount);
//     }
    
//     public async Task<NovelReadDto?> GetNovelByIdAsync(int novelId)
//     {
//         var novel = await _db.Novels
//                 .Include(n => n.User)
//                 .Include(n => n.Stats)
//                 .Include(n => n.NovelTags)
//                     .ThenInclude(nt => nt.Tag)
//                 .FirstOrDefaultAsync(n => n.Id == novelId);
//         return novel == null ? null : _mapper.Map<NovelReadDto>(novel);
//     }
//     public async Task<NovelReadDto?> UpdateNovelAsync(int novelId, UpdateNovelDto dto)
//     {
        
//     }
//     public async Task<NovelReadDto?> SoftDeleteNovelAsync(int novelId);
//     public async Task<NovelReadDto?> RestoreNovelAsync(int novelId);
// }
// }
