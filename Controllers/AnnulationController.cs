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
    public class AnnulationController : ControllerBase
    {
        private AppDbContext dbc = new AppDbContext();
        [HttpGet]
        public async Task<IActionResult> Affichage()
        {

            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }

            try
            {

                string select = "SELECT * FROM annulation";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(select, connexion);

                var reader = await commandsql.ExecuteReaderAsync();
                var ListAnnulation = new List<Annulation>();
                while (await reader.ReadAsync())
                {

                    string nom = reader.GetString(reader.GetOrdinal("nomp"));
                    long phone = reader.GetInt64(reader.GetOrdinal("phone"));
                    string mailaka = reader.GetString(reader.GetOrdinal("mailaka"));
                    string numvol = reader.GetString(reader.GetOrdinal("numvol"));
                    DateTime datevoyage = reader.GetDateTime(reader.GetOrdinal("datevoyage"));
                    TimeSpan heurevoayge = reader.GetTimeSpan(reader.GetOrdinal("heurevoyage"));
                    string motif = reader.GetString(reader.GetOrdinal("motif"));
                    string methodepaiement = reader.GetString(reader.GetOrdinal("methodepaiement"));
                    DateTime datetrans = reader.GetDateTime(reader.GetOrdinal("datetrans"));
                    double numtrans = reader.GetDouble(reader.GetOrdinal("numtrans"));
                    DateTime datedemande = reader.GetDateTime(reader.GetOrdinal("datedemande"));
                    string valide = reader.GetString(reader.GetOrdinal("valide"));

                    var annulations = new Annulation
                    {
                        NomP = nom,
                        Phone = phone,
                        Mailaka = mailaka,
                        NumVol = numvol,
                        DateVoyage = datevoyage,
                        HeureVoyage = heurevoayge,
                        Motif = motif,
                        MethodePaiement = methodepaiement,
                        DateTrans = datetrans,
                        NumTrans = numtrans,
                        DateDemande = datedemande,
                        Valide = valide
                    };
                    ListAnnulation.Add(annulations);
                    continue;
                }
                return Ok(ListAnnulation);
            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return Ok("Erreur : " + erreur.Message);
            }
        }
        [Route("action-annulation")]
        [HttpPost]
        public async Task<IActionResult> DemandeAnnulation([FromBody] Annulation annulation)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }

            try
            {

                string demande = "INSERT INTO annulation(nomp, phone, mailaka, numvol, datevoyage, heurevoyage, motif, methodepaiement, datetrans, numtrans, datedemande, valide)" +
                "VALUES (@Nomp, @Phone, @Mailaka, @NumVol, @DateVoyage, @HeureVoyage, @Motif, @MethodePaiement, @DateTrans, @NumTrans, @DateDemande, 'Non')";
                using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexiondb.Open();
                using var commandsql = new NpgsqlCommand(demande, connexiondb);

                commandsql.Parameters.AddWithValue("Nomp", annulation.NomP);
                commandsql.Parameters.AddWithValue("Phone", annulation.Phone);
                commandsql.Parameters.AddWithValue("Mailaka", annulation.Mailaka);
                commandsql.Parameters.AddWithValue("NumVol", annulation.NumVol);
                commandsql.Parameters.AddWithValue("DateVoyage", annulation.DateVoyage);
                commandsql.Parameters.AddWithValue("HeureVoyage", annulation.HeureVoyage);
                commandsql.Parameters.AddWithValue("Motif", annulation.Motif);
                commandsql.Parameters.AddWithValue("MethodePaiement", annulation.MethodePaiement);
                commandsql.Parameters.AddWithValue("DateTrans", annulation.DateTrans);
                commandsql.Parameters.AddWithValue("Numtrans", annulation.NumTrans);
                commandsql.Parameters.AddWithValue("DateDemande", annulation.DateDemande);
                // commandsql.Parameters.AddWithValue("Valide", annulation.Valide);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("Votre demande a été envoyée au responsable !");

            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return Ok("Erreur : " + erreur.Message);
            }
        }
        [Route("supprimer-demande/{Phone}")]
        [HttpDelete]
        public async Task<IActionResult> Suppression(string Phone)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                string supprimerDemande = "DELETE FROM annulation WHERE phone ='" + Phone + "'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(supprimerDemande, connexion);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("La demande d'annulation de cette personne est supprimée.");
            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return Ok("Erreur : " + erreur.Message);
            }
        }
        [Route("recherche-demande-annulation/{recherche}")]
        [HttpGet]
        public async Task<IActionResult> RechercheDemande(string? recherche)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }

            try
            {
                var search = recherche.ToLower();
                string select = "SELECT * FROM annulation WHERE mailaka ILIKE '%" + search + "%' OR nomp ILIKE '%" + search + "%'"+
                " or valide ILIKE '%"+search+"%' or methodepaiement ILIKE '%"+search+"%' or numVol ILIKE '%"+search+"%'";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(select, connexion);

                var reader = await commandsql.ExecuteReaderAsync();
                var ListAnnulationRecherche = new List<Annulation>();
                while (await reader.ReadAsync())
                {

                    string nom = reader.GetString(reader.GetOrdinal("nomp"));
                    long phone = reader.GetInt64(reader.GetOrdinal("phone"));
                    string mailaka = reader.GetString(reader.GetOrdinal("mailaka"));
                    string numvol = reader.GetString(reader.GetOrdinal("numvol"));
                    DateTime datevoyage = reader.GetDateTime(reader.GetOrdinal("datevoyage"));
                    TimeSpan heurevoayge = reader.GetTimeSpan(reader.GetOrdinal("heurevoyage"));
                    string motif = reader.GetString(reader.GetOrdinal("motif"));
                    string methodepaiement = reader.GetString(reader.GetOrdinal("methodepaiement"));
                    DateTime datetrans = reader.GetDateTime(reader.GetOrdinal("datetrans"));
                    double numtrans = reader.GetDouble(reader.GetOrdinal("numtrans"));
                    DateTime datedemande = reader.GetDateTime(reader.GetOrdinal("datedemande"));
                    string valide = reader.GetString(reader.GetOrdinal("valide"));

                    var annulations = new Annulation
                    {
                        NomP = nom,
                        Phone = phone,
                        Mailaka = mailaka,
                        NumVol = numvol,
                        DateVoyage = datevoyage,
                        HeureVoyage = heurevoayge,
                        Motif = motif,
                        MethodePaiement = methodepaiement,
                        DateTrans = datetrans,
                        NumTrans = numtrans,
                        DateDemande = datedemande,
                        Valide = valide
                    };
                    ListAnnulationRecherche.Add(annulations);
                    continue;
                }
                return Ok(ListAnnulationRecherche);
            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return Ok("Erreur : " + erreur.Message);
            }
        }
        [Route("vue-annulation")]
        [HttpGet]
        public async Task<IActionResult> VueAnnulation(string mail)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }

            try
            {

                string select = "SELECT * FROM annulation WHERE mailaka = '" + mail + "'";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(select, connexion);

                var reader = await commandsql.ExecuteReaderAsync();
                var ListAnnulationVue = new List<Annulation>();
                while (await reader.ReadAsync())
                {

                    string nom = reader.GetString(reader.GetOrdinal("nomp"));
                    long phone = reader.GetInt64(reader.GetOrdinal("phone"));
                    string mailaka = reader.GetString(reader.GetOrdinal("mailaka"));
                    string numvol = reader.GetString(reader.GetOrdinal("numvol"));
                    DateTime datevoyage = reader.GetDateTime(reader.GetOrdinal("datevoyage"));
                    TimeSpan heurevoayge = reader.GetTimeSpan(reader.GetOrdinal("heurevoyage"));
                    string motif = reader.GetString(reader.GetOrdinal("motif"));
                    string methodepaiement = reader.GetString(reader.GetOrdinal("methodepaiement"));
                    DateTime datetrans = reader.GetDateTime(reader.GetOrdinal("datetrans"));
                    double numtrans = reader.GetDouble(reader.GetOrdinal("numtrans"));
                    DateTime datedemande = reader.GetDateTime(reader.GetOrdinal("datedemande"));
                    string valide = reader.GetString(reader.GetOrdinal("valide"));

                    var annulations = new Annulation
                    {
                        NomP = nom,
                        Phone = phone,
                        Mailaka = mailaka,
                        NumVol = numvol,
                        DateVoyage = datevoyage,
                        HeureVoyage = heurevoayge,
                        Motif = motif,
                        MethodePaiement = methodepaiement,
                        DateTrans = datetrans,
                        NumTrans = numtrans,
                        DateDemande = datedemande,
                        Valide = valide
                    };
                    ListAnnulationVue.Add(annulations);
                }
                return Ok(ListAnnulationVue);
            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return Ok("Erreur : " + erreur.Message);
            }
        }
        [Route("afficher-informations")]
        [HttpGet]
        public async Task<IActionResult> AfficherInformations(string email){
            if(!ModelState.IsValid){

                return BadRequest(ModelState);
            }

            try{

                string verifier = "SELECT passager.nompassager,passager.telephone,passager.email, vol.datedepart, vol.heuredepart, vente_billet.modepaiement, vente_billet.datetransaction"+
                ", vol.numerovol, vente_billet.montant FROM passager,reservation, vente_billet,vol"+
                " WHERE passager.id=vente_billet.passagerid AND passager.id =  reservation.passagerid AND reservation.volid = vol.id "+
                "AND passager.email ='"+email+"'";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();

                using var commandsql = new NpgsqlCommand(verifier, connexion);

                var reader = await commandsql.ExecuteReaderAsync();

                var ListP = new List<Passager>();
                var ListVB = new List<VenteBillet>();
                var ListV = new List<Vol>();

                if(await reader.ReadAsync()){
                    string nom = reader.GetString(reader.GetOrdinal("nompassager"));
                    string mail = reader.GetString(reader.GetOrdinal("email"));
                    long phone = reader.GetInt64(reader.GetOrdinal("telephone"));
                    string numvol = reader.GetString(reader.GetOrdinal("numerovol"));
                    DateTime dateDe = reader.GetDateTime(reader.GetOrdinal("datedepart"));
                    TimeSpan heure = reader.GetTimeSpan(reader.GetOrdinal("heuredepart"));
                    string modepaye = reader.GetString(reader.GetOrdinal("modepaiement"));
                    DateTime datetrans = reader.GetDateTime(reader.GetOrdinal("datetransaction"));
                    double montant = reader.GetDouble(reader.GetOrdinal("montant"));

                    var passagers = new Passager{
                        Email = mail,
                        NomPassager = nom,
                        Telephone = phone,

                    };
                    
                    ListP.Add(passagers);

                    var vb = new VenteBillet{
                        ModePaiement = modepaye,
                        DateTransaction = datetrans,
                        Montant = montant,
                    };
                    ListVB.Add(vb);

                    var vols = new Vol{
                        NumeroVol = numvol,
                        DateDepart = dateDe,
                        HeureDepart = heure,
                        
                    };
                    ListV.Add(vols);
                }
                var mergedList = ListP.Zip(ListVB, (passager, vente) => new { Passager = passager, VenteBillet = vente })
                .Zip(ListV, (pt, vol) => new { Passager = pt.Passager, VenteBillet = pt.VenteBillet, Vol = vol })
                .ToList();

                foreach (var tuple in mergedList)
                {
                    Passager passager = tuple.Passager;
                    VenteBillet vente = tuple.VenteBillet;
                    Vol vol = tuple.Vol;
                }
                return Ok(mergedList);
            } catch(Npgsql.NpgsqlException erreur){
                return Ok("Erreur : "+erreur.Message);
            }
        }
        [Route("edit-validation-annulation/{mailaka}")]
        [HttpGet]
        public async Task<IActionResult> EditValidation(string mailaka){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string editValidation = "SELECT valide FROM annulation WHERE mailaka = '"+mailaka+"'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var command = new NpgsqlCommand(editValidation, connexion);
                var reader = await command.ExecuteReaderAsync();
                var valideListe = new List<Annulation>();
                if (await reader.ReadAsync()){
                    var v = new Annulation{
                        Valide = reader.GetString(reader.GetOrdinal("valide")),
                    };
                    valideListe.Add(v);
                }
                return Ok(valideListe);
            }
            catch (Npgsql.NpgsqlException e)
            {
                
                return Ok("erreur :"+e.Message);
            }
        }
        [Route("modifier-validation/{mail}")]
        [HttpPost]
        public async Task<IActionResult> ModifierValidation([FromBody] Annulation annulation, string mail){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string modifierValider= "UPDATE annulation SET valide=@Valide WHERE mailaka='"+mail+"'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(modifierValider, connexion);

                commandsql.Parameters.AddWithValue("Valide", annulation.Valide);

                await commandsql.ExecuteNonQueryAsync();
                return Ok("Vous avez validé l'annulation.");
            }
            catch (Npgsql.NpgsqlException e)
            {
                
                return Ok("erreur : "+e.Message);
            }
        }
        [Route("count-nonValid")]
        [HttpGet]
        public async Task<IActionResult> CountNonValid(){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string afficher = "SELECT * FROM annulation WHERE valide != 'Oui'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var command = new NpgsqlCommand(afficher, connexion);

                var reader = await command.ExecuteReaderAsync();
                var liste = new List<Annulation>();

                while(await reader.ReadAsync()){
                    var annulations = new Annulation{
                        Valide = reader.GetString(reader.GetOrdinal("valide")),
                    };
                    liste.Add(annulations);
                    continue;
                }
                return Ok(liste);
            }
            catch (Npgsql.NpgsqlException e)
            {
                
                return Ok("erreur :"+e.Message);
            }
        }
}
}