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
                        StatutPaiement = reader.GetString(reader.GetOrdinal("statutpaiement")),
                        ModePaiement = reader.GetString(reader.GetOrdinal("modepaiement")),
                        Numerov = reader.GetString(reader.GetOrdinal("numerov")),

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
                string daty = "SELECT vol.datedepart, vente_billet.numerov FROM vol, vente_billet WHERE vol.numerovol=vente_billet.numerov AND vente_billet.numerov ='"+vente.Numerov+"'";
                using var condate = new NpgsqlConnection(dbc.Database.GetConnectionString());
                condate.Open();
                using var cmddate = new NpgsqlCommand(daty, condate);
                var readdate = await cmddate.ExecuteReaderAsync();
                var datee ="";
                var idv = "";
                if (await readdate.ReadAsync())
                {
                    DateTime datyy = readdate.GetDateTime(readdate.GetOrdinal("datedepart"));
                    datee=datyy.ToString();  
                    string vid = readdate.GetString(readdate.GetOrdinal("numerov"));
                     idv = vid;
                }
                Console.WriteLine(datee);
                Console.WriteLine(idv);
                if (datee!="" && idv == vente.Numerov)
                {
                    return Ok("Vous avez déjà acheté un billet pour cette date du vol");
                }
                string achatbillet = "INSERT INTO vente_billet(passagerid, montant, datetransaction, statutpaiement, modepaiement, numerov)"+
                "VALUES(@PassagerId, @Montant, @DateTransaction, @Statutpaiement, @ModePaiement, @Numerov)";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(achatbillet, connexion);

                commandsql.Parameters.AddWithValue("PassagerId", vente.PassagerId);
                commandsql.Parameters.AddWithValue("Montant", vente.Montant);
                commandsql.Parameters.AddWithValue("DateTransaction", vente.DateTransaction);
                commandsql.Parameters.AddWithValue("Statutpaiement", vente.StatutPaiement);
                commandsql.Parameters.AddWithValue("ModePaiement", vente.ModePaiement);
                commandsql.Parameters.AddWithValue("Numerov", vente.Numerov);

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
                string AfficherVentes = "SELECT * FROM vente_billet where statutpaiement ILIKE '%"+karoka+"%' OR modepaiement ILIKE '%"+karoka+"%'";
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
                        StatutPaiement = reader.GetString(reader.GetOrdinal("statutpaiement")),
                        ModePaiement = reader.GetString(reader.GetOrdinal("modepaiement")),
                        Numerov = reader.GetString(reader.GetOrdinal("numerov"))

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