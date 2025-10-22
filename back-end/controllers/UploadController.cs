using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.DTOs;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;


namespace Api.Controllers
{
    [ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly AppDbContext _db;

    public UploadController(IWebHostEnvironment env, AppDbContext db)
    {
        _env = env;
        _db = db;
    }

    [HttpPost("cover-temp")]
    [Authorize]
    public async Task<IActionResult> UploadTempCover(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest(new { message = "No file uploaded." });
        if (file.Length > 10 * 1024 * 1024) // 10 MB limit (adjust)
            return BadRequest(new { message = "File too large."});// new { message = }

        // Basic content-type whitelist
        var allowed = new[] { "image/jpeg", "image/png", "image/webp" };
        if (!allowed.Contains(file.ContentType))
            return BadRequest(new { message = "Unsupported image type." });

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // Create uploads/temp folder
        var tempDir = Path.Combine(_env.WebRootPath, "uploads", "temp", userId.ToString());
        if (!Directory.Exists(tempDir)) Directory.CreateDirectory(tempDir);

        // Delete existing temp files for this user (both on disk and DB record)
        var existingTemps = _db.UploadedFiles.Where(f => f.UserId == userId && f.IsTemporary);
        foreach (var existing in existingTemps)
        {
            try { if (System.IO.File.Exists(existing.FilePath)) System.IO.File.Delete(existing.FilePath); } catch { }
            _db.UploadedFiles.Remove(existing);
        }
        await _db.SaveChangesAsync();

        // Save new file with GUID name
        var ext = Path.GetExtension(file.FileName);
        var fileName = Guid.NewGuid().ToString() + ext;
        var filePath = Path.Combine(tempDir, fileName);

        // Optionally: load into an image library to resize/compress here
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var url = $"{Request.Scheme}://{Request.Host}/uploads/temp/{userId}/{fileName}";

        var uploaded = new UploadedFile {
            UserId = userId,
            FileName = fileName,
            FilePath = filePath,
            FileUrl = url,
            IsTemporary = true,
            UploadedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(24) // TTL
        };
        _db.UploadedFiles.Add(uploaded);
        await _db.SaveChangesAsync();

        return Ok(new { tempFileId = uploaded.Id, url });
    }
}

}
