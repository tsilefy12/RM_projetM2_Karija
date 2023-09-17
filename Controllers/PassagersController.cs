using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using apiWebCore.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using PostgreSQLAPI.Models;

namespace apiWebCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PassagersController : Controller
    {
        private AppDbContext dbc = new AppDbContext();

        [HttpGet]

        public async Task<IActionResult> Affichage()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                try
                {
                    string selectPassagers = "select * from passager";

                    using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                    connexiondb.Open();
                    using var commandsql = new NpgsqlCommand(selectPassagers, connexiondb);

                    using var reader = await commandsql.ExecuteReaderAsync();

                    var listPassagers = new List<Passager>();

                    while (await reader.ReadAsync())
                    {

                        int id = reader.GetInt32(reader.GetOrdinal("id"));
                        string nompassager = reader.GetString(reader.GetOrdinal("nompassager"));
                        string adreseepassager = reader.GetString(reader.GetOrdinal("adressepassager"));
                        long telephone = reader.GetInt64(reader.GetOrdinal("telephone"));
                        string email = reader.GetString(reader.GetOrdinal("email"));
                        string password = reader.GetString(reader.GetOrdinal("password"));

                        var passagers = new Passager
                        {
                            IdPassager = id,
                            NomPassager = nompassager,
                            Adressepassager = adreseepassager,
                            Telephone = telephone,
                            Email = email,
                            Password = password,
                        };
                        listPassagers.Add(passagers);
                    }
                    return Ok(listPassagers);
                }
                catch (Npgsql.NpgsqlException e)
                {
                    return Ok("erreur s'est produite : " + e.Message);
                }
            }
        }
        [Route("inscription-passagers")]
        [HttpPost]
        public async Task<IActionResult> Ajout([FromBody] Passager passager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string inscriptionPassager = "INSERT INTO passager(nompassager, adressepassager, telephone, email, password)" +
                "VALUES(@NomPassager, @AdressePassager, @Telephone, @Email, @Password)";

                using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexiondb.Open();
                using var command = new NpgsqlCommand(inscriptionPassager, connexiondb);

                var hasher = new PasswordHasher<Passager>();
                var pwdHashed = hasher.HashPassword(null!, passager.Password);
                
                command.Parameters.AddWithValue("NomPassager", passager.NomPassager);
                command.Parameters.AddWithValue("AdressePassager", passager.Adressepassager);
                command.Parameters.AddWithValue("Telephone", passager.Telephone);
                command.Parameters.AddWithValue("Email", passager.Email);
                command.Parameters.AddWithValue("Password", pwdHashed);

                await command.ExecuteNonQueryAsync();

                return Ok("Vous êtes inscrit avec succès !");
            } catch(Npgsql.NpgsqlException erreur){
                return Ok("Erreur apparait : " + erreur.Message);
            }

        }
    }
}