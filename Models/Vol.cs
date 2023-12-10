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
        public string AvionId { get; set; } = null!;
        [JsonIgnore]
       public Avion? Avion { get; set; }

        [Column("itinerairesid")]
        public int IdItineraire { get; set; } 

        [Column("datedepart")]
        [DataType(DataType.Date)]
        public DateTime DateDepart { get; set; }
        
        [Column("datearrivee")]
        public DateTime DateArrivee { get; set; }

        // [DataType(DataType.Time)]
        // [DisplayFormat(DataFormatString = "{0:HH:mm}", ApplyFormatInEditMode = true)]
        [Column("heuredepart")]
        public TimeSpan HeureDepart { get; set; }

        [Column("capacitemax")]
        public int CapaciteMax { get; set; }

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
