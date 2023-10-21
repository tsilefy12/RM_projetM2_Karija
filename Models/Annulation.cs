using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace apiWebCore.Models
{
    [Table("annulation")]
    public class Annulation
    {
        [Key]
        [Column("mailaka")]
        public string Mailaka { get; set; } = null!;


        [Column("nomp")]
        public string NomP { get; set; } = null!;

        [Column("phone")]
        public long Phone { get; set; }


        [Column("numvol")]
        public string NumVol { get; set; } = null!;

        [Column("datevoyage")]
        public DateTime DateVoyage { get; set; }

        [Column("heurevoyage")]
        public TimeSpan HeureVoyage { get; set; }

        [Column("motif")]
        public string Motif { get; set; } = null!;

        [Column("methodepaiement")]
        public string MethodePaiement { get; set; } = null!;

        [Column("datetrans")]
        public DateTime DateTrans { get; set; }

        [Column("numtrans")]
        public double NumTrans { get; set; }

        [Column("datedemande")]
        public DateTime DateDemande { get; set; }

        [Column("valide")]
        public string Valide { get; set; } = null!;
    }
    public class HeureVoyageModel
    {
        public long Ticks { get; set; }
        public int Days { get; set; }
        public int Hours { get; set; }
        public int Milliseconds { get; set; }
        public int Minutes { get; set; }
        public int Seconds { get; set; }
        public string HeureV { get; set; }
    }
}