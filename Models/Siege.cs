using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apiWebCore.Models
{
    [Table("siege")]
    public class Siege
    {
        [Key]
        [Column("id")]
        public int IdSiege { get; set; }

        [Column("numerosiege")]
        public string NumeroSiege { get; set; } = null!;

        [Column("classetarif")]
        public string ClasseTarif { get; set; } = null!;

        [Column("statut")]
        public string Statut { get; set; } = null!;

    }
}
