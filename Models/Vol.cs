﻿using Microsoft.VisualBasic;
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
        public Avion Avion { get; set; } = null!;

        [Column("numerovol")]
        public string NumeroVol { get; set; } = null!;

        [Column("datedepart")]
        public DateTime DateDepart { get; set; }

        [Column("heuredepart")]
        public string HeureDepart { get; set; } = null!; 

        [Column("capacitemax")]
        public int CapaciteMax { get; set; }

        [Column("lieudepart")]
        public string LieuDepart { get; set; } = null!;

        [Column("lieuarrivee")]
        public string LieuArrivee { get; set; } = null!;
    }
}
