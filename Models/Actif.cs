using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace apiWebCore.Models
{
    [Table("actif")]
    public class Actif
    {
        [Key]
        [Column("mailconnecte")]
        public string MailConnecte { get; set; } = null!;
    }
}