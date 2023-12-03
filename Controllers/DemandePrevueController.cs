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
    public class DemandePrevueController : ControllerBase
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

                string selectDemande = "select passager.nompassager, passager.email, passager.telephone, prevision.id, prevision.dateprevue," +
                " itineraires.lieudepart, itineraires.lieuarrivee, prevision.avisreponsable,  prevision.datedemande, prevision.typetarif, prevision.itinerairesid " +
                " from passager, prevision, itineraires where passager.id = prevision.passagerid and itineraires.id=prevision.itinerairesid order by prevision.id asc";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(selectDemande, connexion);

                var reader = await commandsql.ExecuteReaderAsync();
                var ListDemande = new List<Demande>();
                var ListPassager = new List<Passager>();
                var ListeItineraires = new List<Itineraire>();
                while (await reader.ReadAsync())
                {

                    string avisreponsable = reader.GetString(reader.GetOrdinal("avisreponsable"));
                    DateTime dateprevue = reader.GetDateTime(reader.GetOrdinal("dateprevue"));
                    string typetarif = reader.GetString(reader.GetOrdinal("typetarif"));
                    string nom = reader.GetString(reader.GetOrdinal("nompassager"));
                    string mailadressepassager = reader.GetString(reader.GetOrdinal("email"));
                    long phone = reader.GetInt64(reader.GetOrdinal("telephone"));
                    string lieudepart = reader.GetString(reader.GetOrdinal("lieudepart"));
                    string lieuarrivee = reader.GetString(reader.GetOrdinal("lieuarrivee"));
                    DateTime datedemande = reader.GetDateTime(reader.GetOrdinal("datedemande"));
                    int itineraireid = reader.GetInt32(reader.GetOrdinal("itinerairesid"));

                    var demandes = new Demande
                    {
                        IdPrevision = reader.GetInt32(reader.GetOrdinal("id")),
                        AvisResponsable = avisreponsable,
                        DatePrevue = dateprevue,
                        TypeTarif = typetarif,
                        DateDemande = datedemande,
                        ItinerairesId = itineraireid
                    };
                    ListDemande.Add(demandes);

                    var clients = new Passager
                    {
                        NomPassager = nom,
                        Email = mailadressepassager,
                        Telephone = phone
                    };
                    ListPassager.Add(clients);

                    var itineraires = new Itineraire
                    {
                        LiueDepart = lieudepart,
                        LieuArrivee = lieuarrivee
                    };
                    ListeItineraires.Add(itineraires);
                    continue;
                }
                IEnumerable<Demande> demandeEnumerable = ListDemande.AsEnumerable();
                IEnumerable<Passager> passagerEnumerable = ListPassager.AsEnumerable();
                IEnumerable<Itineraire> itineraireEnumerable = ListeItineraires.AsEnumerable();

                var fusion = demandeEnumerable.Zip(passagerEnumerable, (demande, passager) => new { Demande = demande, Passager = passager })
                .Zip(itineraireEnumerable, (dp, itineraire) => new { DemandePassager = dp, Itineraire = itineraire });

                return Ok(fusion);
            }
            catch (Npgsql.NpgsqlException erreur)
            {
                return Ok("erreur : " + erreur.Message);
            }
        }
        [Route("demande-prevue")]
        [HttpPost]
        public async Task<IActionResult> Demande([FromBody] Demande demande)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                string demandePrevue = "insert into prevision(passagerid, dateprevue, avisreponsable, itinerairesid, typetarif, datedemande)" +
                " values(@PassagerId, @DatePrevue, 'inconnue', @Itinerairesid, @Typetarif, @Datedemande)";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(demandePrevue, connexion);

                commandsql.Parameters.AddWithValue("PassagerId", demande.IdPassager);
                commandsql.Parameters.AddWithValue("Dateprevue", demande.DatePrevue);
                commandsql.Parameters.AddWithValue("Itinerairesid", demande.ItinerairesId);
                commandsql.Parameters.AddWithValue("Typetarif", demande.TypeTarif);
                commandsql.Parameters.AddWithValue("Datedemande", demande.DateDemande);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("Votre demande a été envoyée.");
            }
            catch (Npgsql.NpgsqlException erreur)
            {
                return BadRequest("Une erreur s'est produite lors de la requête : " + erreur.Message);
            }
        }
        [Route("supprimer-demande/{IdPrevision}")]
        [HttpDelete]
        public async Task<IActionResult> Suppression(int IdPrevision)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                string deleteByidPassager = "delete from prevision where id =" + IdPrevision;

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());

                connexion.Open();
                using var commandsql = new NpgsqlCommand(deleteByidPassager, connexion);
                await commandsql.ExecuteNonQueryAsync();

                return Ok("une demande est supprimée.");
            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return BadRequest("Erreur : " + erreur.Message);
            }
        }
        [Route("rechercher-demande-prevision")]
        [HttpGet]
        public async Task<IActionResult> Rechercher(string recherche)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {


                string selectDemande = "select passager.nompassager, passager.email, passager.telephone, prevision.id, prevision.dateprevue," +
                " itineraires.lieudepart, itineraires.lieuarrivee, prevision.avisreponsable,  prevision.datedemande, prevision.typetarif" +
                " from passager, prevision, itineraires where passager.id = prevision.passagerid and itineraires.id=prevision.itinerairesid and passager.email = '" + recherche + "'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(selectDemande, connexion);

                var reader = await commandsql.ExecuteReaderAsync();
                var ListDemande = new List<Demande>();
                var ListPassager = new List<Passager>();
                while (await reader.ReadAsync())
                {
                    int id = reader.GetInt32(reader.GetOrdinal("id"));
                    string avisreponsable = reader.GetString(reader.GetOrdinal("avisreponsable"));
                    DateTime dateprevue = reader.GetDateTime(reader.GetOrdinal("dateprevue"));
                    string typetarif = reader.GetString(reader.GetOrdinal("typetarif"));
                    string nom = reader.GetString(reader.GetOrdinal("nompassager"));
                    string mailadressepassager = reader.GetString(reader.GetOrdinal("email"));
                    long phone = reader.GetInt64(reader.GetOrdinal("telephone"));
                    string lieudepart = reader.GetString(reader.GetOrdinal("lieudepart"));
                    string lieuarrivee = reader.GetString(reader.GetOrdinal("lieuarrivee"));
                    DateTime datedemande = reader.GetDateTime(reader.GetOrdinal("datedemande"));
                    int itineraireid = reader.GetInt32(reader.GetOrdinal("itinerairesid"));

                    var demandes = new Demande
                    {
                        IdPrevision = id,
                        AvisResponsable = avisreponsable,
                        DatePrevue = dateprevue,
                        TypeTarif = typetarif,
                        DateDemande = datedemande,
                        ItinerairesId = itineraireid
                    };
                    ListDemande.Add(demandes);

                    var clients = new Passager
                    {
                        NomPassager = nom,
                        Email = mailadressepassager,
                        Telephone = phone
                    };
                    ListPassager.Add(clients);
                    continue;
                }
                IEnumerable<Demande> demandeEnumerable = ListDemande.AsEnumerable();
                IEnumerable<Passager> passagerEnumerable = ListPassager.AsEnumerable();

                // Fusionner les deux listes en utilisant Zip
                var fusion = demandeEnumerable.Zip(passagerEnumerable, (demande, passager) => new { Demande = demande, Passager = passager });
                return Ok(fusion);
            }
            catch (Npgsql.NpgsqlException erreur)
            {
                return Ok("erreur : " + erreur.Message);
            }
        }
        [Route("edit-demande-prevision/{Id}")]
        [HttpGet]
        public async Task<IActionResult> EditDemande(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }

            try
            {
                string edit = "SELECT avisreponsable FROM prevision WHERE id ='" + Id + "'";
                var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                var cmd = new NpgsqlCommand(edit, connexion);
                var read = await cmd.ExecuteReaderAsync();

                var list = new List<Demande>();

                while (await read.ReadAsync())
                {
                    string avis = read.GetString(read.GetOrdinal("avisreponsable"));

                    var demandes = new Demande
                    {
                        AvisResponsable = avis
                    };
                    list.Add(demandes);
                }

                return Ok(list);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("Erreur :" + e.Message);
            }
        }
        [Route("modification-demande-prevision/{Id}")]
        [HttpPost]
        public async Task<IActionResult> ModifierDemande([FromBody] Demande demande, int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string modifier = "UPDATE prevision SET avisreponsable=@Avisreponsable WHERE id='" + Id + "'";
                var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexiondb.Open();
                var cmd = new NpgsqlCommand(modifier, connexiondb);

                cmd.Parameters.AddWithValue("Avisreponsable", demande.AvisResponsable);

                await cmd.ExecuteNonQueryAsync();

                return Ok("Modification succès.");
            }
            catch (Npgsql.NpgsqlException e)
            {

                return BadRequest("Erreur :" + e.Message);
            }
        }
    }
}