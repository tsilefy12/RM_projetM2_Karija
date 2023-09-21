using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace apiWebCore.Models
{
    [Table("remboursement")]
    public class Remboursement
    {
        [Key]
        [Column("mailadresse")]
        public string MailAdresse { get; set; } = null!;

        [Column("nompass")]
        public string NomPass { get; set; } = null!;

        [Column("moderemboursement")]
        public string ModeRemboursement { get; set; } = null!;

        [Column("piecejustificative")]
        public string PieceJustificative { get; set; } =  null!;

        [Column("telephoneremboursement")]
        public long TelephoneRemboursement { get; set; } 

        [Column("datedemanderemboursement")]
        public DateTime DateDemandeRemboursement { get; set; }

        [Column("verification")]
        public string Verification { get; set; } = null!;
    }
}