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
    public class ActifController : ControllerBase
    {
        private AppDbContext dbc = new AppDbContext();
        [HttpGet]
        public async Task<IActionResult> Afficher(string mailaconnecte)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string selectMail = "SELECT mailconnecte FROM actif WHERE mailconnecte ='" + mailaconnecte + "'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var cmd = new NpgsqlCommand(selectMail, connexion);
                var reader = await cmd.ExecuteReaderAsync();
                var mail = "";
                if (await reader.ReadAsync())
                {
                    string m = reader.GetString(reader.GetOrdinal("mailconnecte"));
                    mail = m;
                }
                return Ok(mail);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("erreur " + e.Message);
            }
        }
        [Route("ajout-actif")]
        [HttpPost]
        public async Task<IActionResult> Ajout([FromBody] Actif actif)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string selectMail = "SELECT mailconnecte FROM actif WHERE mailconnecte ='" + actif.MailConnecte + "'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var cmd = new NpgsqlCommand(selectMail, connexion);
                var reader = await cmd.ExecuteReaderAsync();
                var mail = "";
                if (await reader.ReadAsync())
                {
                    string m = reader.GetString(reader.GetOrdinal("mailconnecte"));
                    mail = m;
                }
                if (mail == actif.MailConnecte)
                {
                    return Ok("Vous êtes déjà connecté avant");
                }
                else
                {
                    string ajout = "INSERT INTO actif (mailconnecte) VALUES(@MailConnecte)";
                    using var connection = new NpgsqlConnection(dbc.Database.GetConnectionString());
                    connection.Open();
                    using var cmdsql = new NpgsqlCommand(ajout, connection);
                    cmdsql.Parameters.AddWithValue("MailConnecte", actif.MailConnecte);

                    await cmdsql.ExecuteNonQueryAsync();

                    return Ok("Vous êtes connecté");
                }

            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("erreur " + e.Message);
            }
        }
        [Route("deconnecter")]
        [HttpDelete]
        public async Task<IActionResult> Deconnexion(string mail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string supprimer = "DELETE FROM actif WHERE mailconnecte='" + mail + "'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var cmd = new NpgsqlCommand(supprimer, connexion);

                await cmd.ExecuteNonQueryAsync();
                return Ok("Déconnexion encours...");
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("erreur :" + e.Message);
            }
        }
        [Route("tous-actifs")]
         [HttpGet]
        public async Task<IActionResult> Actif()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string selectMail = "SELECT mailconnecte FROM actif";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var cmd = new NpgsqlCommand(selectMail, connexion);
                var reader = await cmd.ExecuteReaderAsync();
                var mail = new List<Actif>();
                while (await reader.ReadAsync())
                {
                    var l = new Actif{
                        MailConnecte = reader.GetString(reader.GetOrdinal("mailconnecte")),
                    };
                    mail.Add(l);
                    continue;
                }
                return Ok(mail);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("erreur " + e.Message);
            }
        }
    }
}