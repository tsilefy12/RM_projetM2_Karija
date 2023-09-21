using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace apiWebCore.Models
{
    [Table("reservation")]
    public class Reservation
    {
        [Key]
        [Column("id")]
        public int IdReservation { get; set; }

        [Column("volid")]
        public int VolId { get; set; }
        public Vol Vol { get; set; } =null!;

        [Column("passagerid")]
        public int PassagerId { get; set; }
        public Passager Passager { get; set; } = null!;

        [Column("tarificationid")]
        public int TarificationId { get; set; }
        public Tarif Tarif { get; set; } = null!;

        [Column("libelle")]
        public string Libelle { get; set; } = null!;

        [Column("datereservation")]
        public DateTime DateReservation { get; set; }

    }
}