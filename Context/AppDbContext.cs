using apiWebCore.Models;
using Microsoft.EntityFrameworkCore;

namespace PostgreSQLAPI.Models
{
    public class AppDbContext : DbContext
    {
       public AppDbContext()
        { }

        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {}
        public DbSet<Avion> Avions { get; set; }
        public DbSet<Siege> Sieges { get; set; }
        public DbSet<CompaginAerienne> compagnies { get; set; }
        public DbSet<Vol> Vols { get; set; }
        public DbSet<Tarif> Tarifs { get; set; }
        public DbSet<Passager> Passagers { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Vol>().HasOne(v => v.Avion).WithMany().HasForeignKey(v => v.AvionId);
            modelBuilder.Entity<Tarif>().HasOne(s => s.Siege).WithMany().HasForeignKey(s => s.IdSiege);
        } 
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host = localhost; Port = 5432; Database = revenu_management; Username= postgres; Password = tsilefy;");
        }
    }
}
