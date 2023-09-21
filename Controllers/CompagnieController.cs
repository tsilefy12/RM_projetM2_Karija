using apiWebCore.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using PostgreSQLAPI.Models;

namespace apiWebCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompagnieController : Controller
    {
        private AppDbContext dbC = new AppDbContext();
        [HttpGet]
        public async Task<IActionResult> Afficher()
        {
            string select = "SELECT * FROM compagnieaerienne";
            List<CompaginAerienne> compagniesList = new List<CompaginAerienne>();
            using var connexionDb = new NpgsqlConnection(dbC.Database.GetConnectionString());
            connexionDb.Open();
            using var command = new NpgsqlCommand(select, connexionDb);
            using var readerCompagnie = await command.ExecuteReaderAsync();
            var compagnies = new CompaginAerienne();
            while (await readerCompagnie.ReadAsync())
            {
                int id = readerCompagnie.GetInt32(readerCompagnie.GetOrdinal("id"));
                string nomcompagnie = readerCompagnie.GetString(readerCompagnie.GetOrdinal("nomcompagnie"));
                string codecompagnie = readerCompagnie.GetString(readerCompagnie.GetOrdinal("codecompagnie"));
                string adresscompagnie = readerCompagnie.GetString(readerCompagnie.GetOrdinal("adressecompagnie"));
                long contact = readerCompagnie.GetInt64(readerCompagnie.GetOrdinal("contact"));
                string emailcompagnie = readerCompagnie.GetString(readerCompagnie.GetOrdinal("emailcompagnie"));

                compagnies = new CompaginAerienne
                {
                    Id = id,
                    NomCompagnie = nomcompagnie,
                    CodeCompagnie = codecompagnie,
                    AdresseCompagnie = adresscompagnie,
                    Contact = contact,
                    EmailCompagnie = emailcompagnie
                };
                compagniesList.Add(compagnies);
                continue;

            }
            return Ok(compagniesList);
        }
        [Route("ajout-compagnie")]
        [HttpPost]
        public async Task<IActionResult> Ajout([FromBody] CompaginAerienne compagnieAerienne ){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try{

                string ajoutCompagnie = "INSERT INTO compagnieaerienne(nomcompagnie,codecompagnie, adressecompagnie, contact, emailcompagnie, pwdcompagnie)"+
                "VALUES(@NomCompagnie,@CodeCompagnie, @AdresseCompagnie, @Contact, @EmailCompagnie, @PwdCompagnie)";

                using var connexiondb = new NpgsqlConnection(dbC.Database.GetConnectionString());
                connexiondb.Open();
                using var commandsql = new NpgsqlCommand(ajoutCompagnie, connexiondb);

                //d'abord on fait un cryptage du mot de passe dans la base de données
                var hasher = new PasswordHasher<CompaginAerienne>();
                var pwdHashed = hasher.HashPassword(null!, compagnieAerienne.PwdCompagnie);

                commandsql.Parameters.AddWithValue("NomCompagnie", compagnieAerienne.NomCompagnie);
                commandsql.Parameters.AddWithValue("CodeCompagnie", compagnieAerienne.CodeCompagnie);
                commandsql.Parameters.AddWithValue("AdresseCompagnie", compagnieAerienne.AdresseCompagnie);
                commandsql.Parameters.AddWithValue("Contact", compagnieAerienne.Contact);
                commandsql.Parameters.AddWithValue("EmailCompagnie", compagnieAerienne.EmailCompagnie);
                commandsql.Parameters.AddWithValue("PwdCompagnie", pwdHashed); 
                
                await commandsql.ExecuteNonQueryAsync();

                return Ok("Compagnie engresitré dans la base de données!");

            } catch(Npgsql.NpgsqlException erreur){
                
                return Ok("Erreur : " +erreur.Message);

            }
        }
        [Route("modification-compagnie")]
        [HttpPost]
        public async Task<IActionResult>  Modification([FromBody] CompaginAerienne compagnie, int Id){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try{

                string modification = "UPDATE compagnieaerienne SET adressecompagnie=@AdresseCompagnie,"+ 
                "contact=@Contact, emailcompagnie=@EmailCompagnie, pwdcompagnie=@PwdCompagnie WHERE id='"+Id+"'";
                using var connexion = new NpgsqlConnection(dbC.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(modification, connexion);

                //d'abord on fait un cryptage du mot de passe dans la base de données
                var hasher = new PasswordHasher<CompaginAerienne>();
                var pwdHashed = hasher.HashPassword(null!, compagnie.PwdCompagnie);

                commandsql.Parameters.AddWithValue("AdresseCompagnie", compagnie.AdresseCompagnie);
                commandsql.Parameters.AddWithValue("Contact", compagnie.Contact);
                commandsql.Parameters.AddWithValue("EmailCompagnie", compagnie.EmailCompagnie);
                commandsql.Parameters.AddWithValue("PwdCompagnie", pwdHashed); 

                await commandsql.ExecuteNonQueryAsync();

                return Ok("Modification succès");

            } catch(Npgsql.NpgsqlException erreur){

                return Ok("Erreur : " +erreur.Message);

            }
        }
        [Route("suppression-compagnie")]
        [HttpDelete]
        public async Task<IActionResult> Suppression(int Id){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try{

                string supprimer = "DELETE FROM compagnieaerienne WHERE id='"+Id+"'";
                using var connexiondb = new NpgsqlConnection(dbC.Database.GetConnectionString());
                connexiondb.Open();

                using var commandsql = new NpgsqlCommand(supprimer, connexiondb);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("Vous avez supprimé un personnel de la compagnie aérienne.");
            } catch(Npgsql.NpgsqlException erreur){

                return Ok("Erreur : " +erreur.Message);
            }
        }
    }
}
