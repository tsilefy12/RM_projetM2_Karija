using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
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
        [JsonIgnore]
        public Vol? Vol { get; set; }

        [Column("passagerid")]
        public int PassagerId { get; set; }

        [JsonIgnore]
        public Passager? Passager { get; set; }

        [Column("tarificationid")]
        public int TarificationId { get; set; }

        [JsonIgnore]
        public Tarif? Tarif { get; set; }

        [Column("nombreplace")]
        public int NombrePlace { get; set; }

        [Column("datereservation")]
        public DateTime DateReservation { get; set; }

    }
    public class ResultatRecherche
{
    public List<Passager> Passagers { get; set; } = null!;
    public List<Reservation> Reservations { get; set; } = null!;
    public List<Vol> Vols { get; set; } = null!;
    public List<Tarif> Tarifs { get; set; } = null!;
}

}