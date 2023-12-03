using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace apiWebCore.Models
{
    [Table("itineraires")]
    public class Itineraire
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("lieudepart")]
        public string LiueDepart {get; set; } = null!;

        [Column("lieuarrivee")]
        public string LieuArrivee { get; set; } = null!;

        [Column("lieuseparateur")]
        public string? LieuSeparteur { get; set; }

        [Column("statut")]
        public string Statut { get; set; } = null!;
    }
}