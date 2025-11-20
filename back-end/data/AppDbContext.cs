using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        //Tables
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Novel> Novels { get; set; } = null!;
        public DbSet<Chapter> Chapters { get; set; } = null!;
        public DbSet<Comment> Comments { get; set; } = null!;
        public DbSet<Tag> Tags { get; set; } = null!;
        public DbSet<NovelTag> NovelTags { get; set; } = null!;
        public DbSet<UploadedFile> UploadedFiles { get; set; } = null!;
        public DbSet<Follow> Follows { get; set; } = null!;
        public DbSet<Favorite> Favorites { get; set; } = null!;
        public DbSet<ReadLater> ReadLaters { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<NovelStats> NovelStats { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // modelBuilder.HasDefaultSchema("webnovelsite");

            // Novel <-> Tag Many-to-Many
            modelBuilder.Entity<NovelTag>()
                .HasKey(nt => new { nt.NovelId, nt.TagId });

            modelBuilder.Entity<NovelTag>()
                .HasOne(nt => nt.Novel)
                .WithMany(n => n.NovelTags)
                .HasForeignKey(nt => nt.NovelId);

            modelBuilder.Entity<NovelTag>()
                .HasOne(nt => nt.Tag)
                .WithMany(t => t.NovelTags)
                .HasForeignKey(nt => nt.TagId);

            // Comment self-referencing for replies
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);

            // User -> Novels 1-to-many
            modelBuilder.Entity<Novel>()
                .HasOne(n => n.User)
                .WithMany(u => u.Novels)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Novels -> Chapters 1-to-many
            modelBuilder.Entity<Chapter>()
                .HasOne(c => c.Novel)
                .WithMany(n => n.Chapters)
                .HasForeignKey(c => c.NovelId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Novel>()
                .HasOne(n => n.Stats)
                .WithOne(s => s.Novel)
                .HasForeignKey<NovelStats>(s => s.Id);

            // Novel -> Comments 1-to-many
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Novel)
                .WithMany(n => n.Comments)
                .HasForeignKey(c => c.NovelId)
                .OnDelete(DeleteBehavior.Cascade);

            // Chapter -> Comments 1-to-many
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Chapter)
                .WithMany(ch => ch.Comments)
                .HasForeignKey(c => c.ChapterId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-one Novel -> CoverImage
            modelBuilder.Entity<Novel>()
                .HasOne(n => n.CoverImage)
                .WithOne(uf => uf.Novel)
                .HasForeignKey<UploadedFile>(uf => uf.NovelId)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> UploadedFiles
            modelBuilder.Entity<UploadedFile>()
                .HasOne(uf => uf.User)
                .WithMany(u => u.UploadedFiles)
                .HasForeignKey(uf => uf.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Tables between user 
            modelBuilder.Entity<Follow>()
                .HasKey(f => new { f.UserId, f.NovelId });
            modelBuilder.Entity<Follow>()
                .HasOne(f => f.User)
                .WithMany(u => u.Follows)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Follow>()
                .HasOne(f => f.Novel)
                .WithMany(n => n.Follows)
                .HasForeignKey(f => f.NovelId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Follow>()
                .HasOne(f => f.LastReadChapter)
                .WithMany()
                .HasForeignKey(f => f.LastReadChapterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Favorite>()
                .HasKey(f => new { f.UserId, f.NovelId });
            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Novel)
                .WithMany(n => n.Favorites)
                .HasForeignKey(f => f.NovelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ReadLater>()
                .HasKey(r => new { r.UserId, r.NovelId });
            modelBuilder.Entity<ReadLater>()
                .HasOne(r => r.User)
                .WithMany(u => u.ReadLaters)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ReadLater>()
                .HasOne(r => r.Novel)
                .WithMany(n => n.ReadLaters)
                .HasForeignKey(r => r.NovelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasKey(r => new { r.UserId, r.NovelId });
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Novel)
                .WithMany(n => n.Reviews)
                .HasForeignKey(r => r.NovelId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}