using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace apiWebCore.Models
{
    [Table("passager")]
    public class Passager
    {
        [Key]
        [Column("id")]
        public int IdPassager { get; set; }

        [Column("nompassager")]
        public string NomPassager { get; set; } = null!;

        [Column("adressepassager")]
        public string Adressepassager { get; set; } = null!;

        [Column("telephone")]
        public long Telephone { get; set; }

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("password")]
        public string Password { get; set; } = null!;

        [Column("typeclient")]
        public string TypeClient {get; set; } = null!;
    }
}