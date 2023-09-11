using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace apiWebCore.Models
{
    [Table("compagnieaerienne")]
    public class CompaginAerienne
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nomcompagnie")]
        public string NomCompagnie { get; set; } = null!;

        [Column("codecompagnie")]
        public string CodeCompagnie { get; set; } = null!;

        [Column("adressecompagnie")]
        public string AdresseCompagnie { get; set; } = null!;

        [Column("contact")]
        public int Contact { get; set; }
        
        [Column("emailcampagnie")]
        public string EmailCompagnie { get; set; } = null!;
    }
}