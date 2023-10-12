using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Text.Json.Serialization;

namespace apiWebCore.Models
{
    [Table("vol")]
    public class Vol
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("avionid")]
        public int AvionId { get; set; }
        [JsonIgnore]
       public Avion? Avion { get; set; }

        [Column("numerovol")]
        public string NumeroVol { get; set; } = null!;

        [Column("datedepart")]
        [DataType(DataType.Date)]
        public DateTime DateDepart { get; set; }

        // [DataType(DataType.Time)]
        // [DisplayFormat(DataFormatString = "{0:HH:mm}", ApplyFormatInEditMode = true)]
        [Column("heuredepart")]
        public TimeSpan HeureDepart { get; set; }

        [Column("capacitemax")]
        public int CapaciteMax { get; set; }

        [Column("lieudepart")]
        public string LieuDepart { get; set; } = null!;

        [Column("lieuarrivee")]
        public string LieuArrivee { get; set; } = null!;

    }
    public class HeureDepartModel
{
    public long Ticks { get; set; }
    public int Days { get; set; }
    public int Hours { get; set; }
    public int Milliseconds { get; set; }
    public int Minutes { get; set; }
    public int Seconds { get; set; }
    public string HeureDepartFormatee { get; set; }
}

}
