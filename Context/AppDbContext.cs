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
        public DbSet<Demande> Demandes { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<VenteBillet> Ventes { get; set; }
        public DbSet<Annulation> Annulations { get; set; }
        public DbSet<Remboursement> Remboursements { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Vol>().HasOne(v => v.Avion).WithMany().HasForeignKey(v => v.AvionId);
            modelBuilder.Entity<Demande>().HasOne(d =>d.Passager).WithMany().HasForeignKey(p =>p.IdPassager);
            modelBuilder.Entity<Reservation>().HasOne(a =>a.Vol).WithMany().HasForeignKey(a =>a.VolId);
            modelBuilder.Entity<Reservation>().HasOne(p =>p.Passager).WithMany().HasForeignKey(p =>p.PassagerId);
            modelBuilder.Entity<Reservation>().HasOne(t =>t.Tarif).WithMany().HasForeignKey(t =>t.TarificationId);
            modelBuilder.Entity<Vol>()
            .Property(v => v.HeureDepart)
            .HasColumnType("time");
            modelBuilder.Entity<Annulation>().Property(d =>d.HeureVoyage).HasColumnType("time");
            } 
            
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host = localhost; Port = 5432; Database = revenu_management; Username= postgres; Password = tsilefy;");
        }
    }
}
