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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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

        }
    }
}