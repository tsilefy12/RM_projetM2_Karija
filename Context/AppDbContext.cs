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
        { }
        public DbSet<Avion> Avions { get; set; }
        public DbSet<Siege> Sieges { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host = localhost; Port = 5432; Database = revenu_management; Username= postgres; Password = tsilefy;");
        }
    }
}
