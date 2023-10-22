using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace apiWebCore.Models
{
    [Table("prevision")]
    public class Demande
    {
        [Key]
        [Column("id")]
        public int IdPrevision { get; set; }

        [Column("passagerid")]
        public int IdPassager { get; set; }
        [JsonIgnore]
        public Passager? Passager { get; set; }

        [Column("demandeprevue")]
        public string DemandePrevue { get; set; } = null!;

        [Column("dateprevue")]
        public DateTime DatePrevue { get; set; }

        [Column("commentaire")]
        public string Commentaire { get; set; } = null!;
    }

}