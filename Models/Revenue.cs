
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace apiWebCore.Models
{
    public class Revenue
    {
    
    public double Tarif { get; set; }
    public string numerovol { get; set; } = null!;
    public int capacitemax { get; set; }
    public DateTime datedepart { get; set; }
    public TimeSpan heuredepart { get; set; }
    public int NombrePassager { get; set; }
    }
}