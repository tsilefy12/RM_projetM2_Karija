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

                string selectDemande = "select passager.id,passager.nompassager, passager.email, passager.telephone,prevision.passagerid, prevision.dateprevue, prevision.demandeprevue, prevision.commentaire" +
                " from passager, prevision where passager.id = prevision.passagerid";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(selectDemande, connexion);

                var reader = await commandsql.ExecuteReaderAsync();
                var ListDemande = new List<Demande>();
                var ListPassager = new List<Passager>();
                while (await reader.ReadAsync())


                {
                    // int id = reader.GetInt32(reader.GetOrdinal("id"));
                    int idpassager = reader.GetInt32(reader.GetOrdinal("id"));
                    string demandeprevue = reader.GetString(reader.GetOrdinal("demandeprevue"));
                    DateTime dateprevue = reader.GetDateTime(reader.GetOrdinal("dateprevue"));
                    string commentaire = reader.GetString(reader.GetOrdinal("commentaire"));
                    string nom = reader.GetString(reader.GetOrdinal("nompassager"));
                    string mailadressepassager = reader.GetString(reader.GetOrdinal("email"));
                    long phone = reader.GetInt64(reader.GetOrdinal("telephone"));

                    var demandes = new Demande
                    {
                        IdPassager = idpassager,
                        DemandePrevue = demandeprevue,
                        DatePrevue = dateprevue,
                        Commentaire = commentaire
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

                string demandePrevue = "insert into prevision(passagerid, demandeprevue, dateprevue, commentaire)" +
                " values(@PassagerId, @DemandePrevue, @DatePrevue, @Commentaire);";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(demandePrevue, connexion);

                commandsql.Parameters.AddWithValue("PassagerId", demande.IdPassager);
                commandsql.Parameters.AddWithValue("DemandePrevue", demande.DemandePrevue);
                commandsql.Parameters.AddWithValue("Dateprevue", demande.DatePrevue);
                commandsql.Parameters.AddWithValue("Commentaire", demande.Commentaire);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("Votre demande a été envoyée.");
            }
            catch (Npgsql.NpgsqlException erreur)
            {

                if (erreur.SqlState == "23503")
                {
                    return BadRequest("Erreur inconnue");
                }
                else
                {
                    return BadRequest("Une erreur s'est produite lors de la requête : " + erreur.Message);
                }
            }
        }
        [Route("supprimer-demande")]
        [HttpDelete]
        public async Task<IActionResult> Suppression(int IdPassager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                string deleteByidPassager = "delete from prevision where passagerid ='" + IdPassager + "'";

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
        public async Task<IActionResult> Rechercher(string recherche){
             if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                string selectDemande = "select passager.id,passager.nompassager, passager.email, passager.telephone,prevision.passagerid, prevision.dateprevue, prevision.demandeprevue, prevision.commentaire" +
                " from passager, prevision where passager.id = prevision.passagerid and  passager.email='"+recherche+"'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(selectDemande, connexion);

                var reader = await commandsql.ExecuteReaderAsync();
                var ListDemande = new List<Demande>();
                var ListPassager = new List<Passager>();
                while (await reader.ReadAsync())


                {
                    // int id = reader.GetInt32(reader.GetOrdinal("id"));
                    int idpassager = reader.GetInt32(reader.GetOrdinal("id"));
                    string demandeprevue = reader.GetString(reader.GetOrdinal("demandeprevue"));
                    DateTime dateprevue = reader.GetDateTime(reader.GetOrdinal("dateprevue"));
                    string commentaire = reader.GetString(reader.GetOrdinal("commentaire"));
                    string nom = reader.GetString(reader.GetOrdinal("nompassager"));
                    string mailadressepassager = reader.GetString(reader.GetOrdinal("email"));
                    long phone = reader.GetInt64(reader.GetOrdinal("telephone"));

                    var demandes = new Demande
                    {
                        IdPassager = idpassager,
                        DemandePrevue = demandeprevue,
                        DatePrevue = dateprevue,
                        Commentaire = commentaire
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
    }
}