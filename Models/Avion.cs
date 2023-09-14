using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apiWebCore.Models
{
    [Table("avion")]
    public class Avion
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("numavion")]
        public string NumeroAvion { get; set; } = null!;

        [Column("modelavion")]
        public string ModelAvion { get; set; } =  null!;

        [Column("capacite")]
        public int Capacite { get; set; }
    }
}
