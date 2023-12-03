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
        [Route("afficher-vente")]
        [HttpGet]
        public async Task<IActionResult> AfficherVente(){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string AfficherVentes = "SELECT * FROM vente_billet";
                using var connexDb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexDb.Open();
                using var cmd = new NpgsqlCommand(AfficherVentes, connexDb);

                var reader = await cmd.ExecuteReaderAsync();
                var listes = new List<VenteBillet>();
                while (await reader.ReadAsync())
                {
                    var ventes = new VenteBillet{
                        IdVente = reader.GetInt32(reader.GetOrdinal("id")),
                        PassagerId = reader.GetInt32(reader.GetOrdinal("passagerid")),
                        Montant = reader.GetDouble(reader.GetOrdinal("montant")),
                        DateTransaction = reader.GetDateTime(reader.GetOrdinal("datetransaction")),
                        NombreBillet = reader.GetInt32(reader.GetOrdinal("nombrebillet")),
                        ModePaiement = reader.GetString(reader.GetOrdinal("modepaiement")),
                        Numerov = reader.GetInt32(reader.GetOrdinal("numerov")),

                    };
                    listes.Add(ventes);
                    continue;  
                }
                return Ok(listes);
            }
            catch (System.Exception)
            {
                throw;
            }
        }
        [Route("achat-du-billet")]
        [HttpPost]
        public async Task<IActionResult> Achat([FromBody] VenteBillet vente){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try{
                string daty = "SELECT vol.datedepart, vente_billet.numerov FROM vol, vente_billet WHERE vol.id=vente_billet.numerov AND vente_billet.numerov ='"+vente.Numerov+"'";
                using var condate = new NpgsqlConnection(dbc.Database.GetConnectionString());
                condate.Open();
                using var cmddate = new NpgsqlCommand(daty, condate);
                var readdate = await cmddate.ExecuteReaderAsync();
                var datee ="";
                var idv = 0;
                if (await readdate.ReadAsync())
                {
                    DateTime datyy = readdate.GetDateTime(readdate.GetOrdinal("datedepart"));
                    datee=datyy.ToString();  
                    int vid = readdate.GetInt32(readdate.GetOrdinal("numerov"));
                    idv = vid;
                }
                Console.WriteLine(datee);
                Console.WriteLine(idv);
                if (datee!="" && idv == vente.Numerov)
                {
                    return Ok("Vous avez déjà acheté un billet pour cette date du vol");
                }
                string achatbillet = "INSERT INTO vente_billet(passagerid, montant, datetransaction, modepaiement, numerov, nombrebillet)"+
                "VALUES(@PassagerId, @Montant, @DateTransaction, @ModePaiement, @Numerov, @Nombrebillet)";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(achatbillet, connexion);

                commandsql.Parameters.AddWithValue("PassagerId", vente.PassagerId);
                commandsql.Parameters.AddWithValue("Montant", vente.Montant);
                commandsql.Parameters.AddWithValue("DateTransaction", vente.DateTransaction);
                commandsql.Parameters.AddWithValue("ModePaiement", vente.ModePaiement);
                commandsql.Parameters.AddWithValue("Numerov", vente.Numerov);
                 commandsql.Parameters.AddWithValue("Nombrebillet", vente.NombreBillet);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("Votre transaction d'achat de billet a réussi!");
            } catch(Npgsql.NpgsqlException erreur){

                return Ok("Erreur : " +erreur.Message);
                
            }
        }

        [Route("rechercher-billet/{recherche}")]
        [HttpGet]
        public async Task<IActionResult> ReschercherBillet(string recherche){
             if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var karoka = recherche.ToLower();
                string AfficherVentes = "SELECT * FROM vente_billet where  modepaiement ILIKE '%"+karoka+"%'";
                using var connexDb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexDb.Open();
                using var cmd = new NpgsqlCommand(AfficherVentes, connexDb);

                var reader = await cmd.ExecuteReaderAsync();
                var listes = new List<VenteBillet>();
                while (await reader.ReadAsync())
                {
                    var ventes = new VenteBillet{
                        IdVente = reader.GetInt32(reader.GetOrdinal("id")),
                        PassagerId = reader.GetInt32(reader.GetOrdinal("passagerid")),
                        Montant = reader.GetDouble(reader.GetOrdinal("montant")),
                        DateTransaction = reader.GetDateTime(reader.GetOrdinal("datetransaction")),
                        NombreBillet = reader.GetInt32(reader.GetOrdinal("nombrebillet")),
                        ModePaiement = reader.GetString(reader.GetOrdinal("modepaiement")),
                        Numerov = reader.GetInt32(reader.GetOrdinal("numerov"))

                    };
                    listes.Add(ventes);
                    continue;  
                }
                return Ok(listes);
            }
            catch (Npgsql.NpgsqlException e)
            {
                
                return Ok("Erreur : "+e.Message);
            }
        }
        [Route("supprimer-billet/{Id}")]
        [HttpDelete]
        public async Task<IActionResult> SupprimerBillet(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string supprimer = "DELETE FROM vente_billet WHERE id ='"+Id+"'";
                using var cnnx = new NpgsqlConnection(dbc.Database.GetConnectionString());

                cnnx.Open();
                using var cmd = new NpgsqlCommand(supprimer, cnnx);

                await cmd.ExecuteNonQueryAsync();

                return Ok("Vous avez supprimé un billet.");
            }
            catch (Npgsql.NpgsqlException e)
            {
                
                return Ok("erreur : "+e.Message);
            }
        }
    }
}