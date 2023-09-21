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
                    string heurevoayge = reader.GetString(reader.GetOrdinal("heurevoyage"));
                    string motif = reader.GetString(reader.GetOrdinal("motif"));
                    string methodepaiement = reader.GetString(reader.GetOrdinal("methodepaiement"));
                    DateTime datetrans = reader.GetDateTime(reader.GetOrdinal("datetrans"));
                    int numtrans = reader.GetInt32(reader.GetOrdinal("numtrans"));
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
                "VALUES (@Nomp, @Phone, @Mailaka, @NumVol, @DateVoyage, @HeureVoyage, @Motif, @MethodePaiement, @DateTrans, @NumTrans, @DateDemande, @Valide)";
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
                commandsql.Parameters.AddWithValue("Valide", annulation.Valide);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("Votre demande a été envoyée au responsable !");

            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return Ok("Erreur : " + erreur.Message);
            }
        }
        [Route("supprimer-demande")]
        [HttpDelete]
        public async Task<IActionResult> Suppression(DateTime DateVoyage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                string supprimerDemande = "DELETE FROM annulation WHERE datevoyage ='" + DateVoyage + "'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(supprimerDemande, connexion);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("toutes les demandes d'annulation pour un voyage du date '" + DateVoyage + "' sont supprimées.");
            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return Ok("Erreur : " + erreur.Message);
            }
        }
        [Route("recherche-demande-annulation")]
        [HttpGet]
        public async Task<IActionResult> RechercheDemande(string? recherche, DateTime daty)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }

            try
            {

                string select = "SELECT * FROM annulation WHERE mailaka = '" + recherche + "' OR datevoyage='" + daty + "'";

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
                    string heurevoayge = reader.GetString(reader.GetOrdinal("heurevoyage"));
                    string motif = reader.GetString(reader.GetOrdinal("motif"));
                    string methodepaiement = reader.GetString(reader.GetOrdinal("methodepaiement"));
                    DateTime datetrans = reader.GetDateTime(reader.GetOrdinal("datetrans"));
                    int numtrans = reader.GetInt32(reader.GetOrdinal("numtrans"));
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
                    string heurevoayge = reader.GetString(reader.GetOrdinal("heurevoyage"));
                    string motif = reader.GetString(reader.GetOrdinal("motif"));
                    string methodepaiement = reader.GetString(reader.GetOrdinal("methodepaiement"));
                    DateTime datetrans = reader.GetDateTime(reader.GetOrdinal("datetrans"));
                    int numtrans = reader.GetInt32(reader.GetOrdinal("numtrans"));
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
                    continue;
                }
                return Ok(ListAnnulationVue);
            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return Ok("Erreur : " + erreur.Message);
            }
        }
    }
}