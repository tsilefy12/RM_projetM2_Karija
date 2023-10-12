using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apiWebCore.Models
{
    [Table("tarification")]
    public class Tarif
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("description")]
        public string Description { get; set; } = null!;

        [Column("prix")]
        public double Prix { get; set; }

        [Column("type")]
        public string TypeTarif { get; set; } = null!;

        [Column("nombreplacedispotarif")]
        public int NombrePlaceDispoTarif {get; set; }

        [Column("statut")]
        public string Statut { get; set; } = null!;
    }
}
