using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace apiWebCore.Models
{
    [Table("vente_billet")]
    public class VenteBillet
    {
        [Key]
        [Column("id")]
        public int IdVente { get; set; }

        [ForeignKey("passagerid")]
        public int PassagerId { get; set; }

        [Column("montant")]
        public double Montant { get; set; }

        [Column("datetransaction")]
        public DateTime DateTransaction { get; set; }

        [Column("statutpaiement")]
        public string StatutPaiement {get; set; } = null!;

        [Column("nombrebillet")]
        public int NombreBillet { get; set; }

        [Column("modepaiement")]
        public string ModePaiement { get; set; } = null!;
    }
}