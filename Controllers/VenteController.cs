using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using apiWebCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using PostgreSQLAPI.Models;

namespace apiWebCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VenteController : ControllerBase
    {
        private AppDbContext dbc = new AppDbContext();
        [Route("achat-du-billet")]
        [HttpPost]
        public async Task<IActionResult> Achat([FromBody] VenteBillet vente){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try{

                string achatbillet = "INSERT INTO vente_billet(passagerid, montant, datetransaction, statutpaiement, modepaiement)"+
                "VALUES(@PassagerId, @Montant, @DateTransaction, @Statutpaiement, @ModePaiement)";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(achatbillet, connexion);

                commandsql.Parameters.AddWithValue("PassagerId", vente.PassagerId);
                commandsql.Parameters.AddWithValue("Montant", vente.Montant);
                commandsql.Parameters.AddWithValue("DateTransaction", vente.DateTransaction);
                commandsql.Parameters.AddWithValue("Statutpaiement", vente.StatutPaiement);
                commandsql.Parameters.AddWithValue("ModePaiement", vente.ModePaiement);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("Votre transaction d'achat de billet a réussi!");
            } catch(Npgsql.NpgsqlException erreur){

                return Ok("Erreur : " +erreur.Message);
                
            }
        }
        [Route("verification-reservation")]
        [HttpGet]
        public async Task<IActionResult> Verification(string Email){
            if(!ModelState.IsValid){

                return BadRequest(ModelState);
            }

            try{

                string verifier = "SELECT passager.nompassager,passager.id, tarification.prix,tarification.type, vol.numerovol, vol.datedepart, vol.lieudepart, vol.lieuarrivee "+
                "FROM passager, reservation, vol, tarification"+
                " WHERE passager.id=reservation.passagerid AND reservation.tarificationid=tarification.id "+
                "AND reservation.volid=vol.id AND email ='"+Email+"'";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();

                using var commandsql = new NpgsqlCommand(verifier, connexion);

                var reader = await commandsql.ExecuteReaderAsync();

                var ListP = new List<Passager>();
                var ListT = new List<Tarif>();
                var ListV = new List<Vol>();

                if(await reader.ReadAsync()){
                    int idP = reader.GetInt32(reader.GetOrdinal("id")); 
                    string nom = reader.GetString(reader.GetOrdinal("nompassager"));
                    double prix = reader.GetDouble(reader.GetOrdinal("prix"));
                    string numvol = reader.GetString(reader.GetOrdinal("numerovol"));
                    string typeT = reader.GetString(reader.GetOrdinal("type"));
                    string depart = reader.GetString(reader.GetOrdinal("lieudepart"));
                    string arrivee = reader.GetString(reader.GetOrdinal("lieuarrivee"));
                    DateTime datydep = reader.GetDateTime(reader.GetOrdinal("datedepart"));

                    var passagers = new Passager{
                        IdPassager = idP,
                        NomPassager = nom,
                    };
                    
                    ListP.Add(passagers);

                    var tarifs = new Tarif{
                        Prix = prix,
                        TypeTarif = typeT
                    };
                    ListT.Add(tarifs);

                    var vols = new Vol{
                        NumeroVol = numvol,
                        DateDepart = datydep,
                        LieuDepart = depart,
                        LieuArrivee = arrivee
                    };
                    ListV.Add(vols);
                }
                var mergedList = ListP.Zip(ListT, (passager, tarif) => new { Passager = passager, Tarif = tarif })
                .Zip(ListV, (pt, vol) => new { Passager = pt.Passager, Tarif = pt.Tarif, Vol = vol })
                .ToList();

                foreach (var tuple in mergedList)
                {
                    Passager passager = tuple.Passager;
                    Tarif tarif = tuple.Tarif;
                    Vol vol = tuple.Vol;
                }
                return Ok(mergedList);
            } catch(Npgsql.NpgsqlException erreur){
                return Ok("Erreur : "+erreur.Message);
            }
        }
    }
}