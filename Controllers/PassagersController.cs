using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
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
                string verifierEmailPassager = "SELECT email FROM passager WHERE email ='" + passager.Email + "'";
                using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexiondb.Open();
                using var cmd = new NpgsqlCommand(verifierEmailPassager, connexiondb);

                var reader = await cmd.ExecuteReaderAsync();
                var textEmail = "";
                while (await reader.ReadAsync())
                {
                    string mailaka = reader.GetString(reader.GetOrdinal("email"));
                    textEmail = mailaka;
                }
                Console.WriteLine("maila " + textEmail);
                reader.Close();
                if (textEmail == passager.Email)
                {
                    return Ok("Vous étes déjà inscrit dans la base de données avec l'adresse mail '" + textEmail + "'");
                }
                else
                {
                    string inscriptionPassager = "INSERT INTO passager(nompassager, adressepassager, telephone, email, password)" +
                    "VALUES(@NomPassager, @AdressePassager, @Telephone, @Email, @Password)";
                    using var command = new NpgsqlCommand(inscriptionPassager, connexiondb);

                    var hasher = new PasswordHasher<Passager>();
                    var pwdHashed = hasher.HashPassword(null!, passager.Password);

                    command.Parameters.AddWithValue("NomPassager", passager.NomPassager);
                    command.Parameters.AddWithValue("AdressePassager", passager.Adressepassager);
                    command.Parameters.AddWithValue("Telephone", passager.Telephone);
                    command.Parameters.AddWithValue("Email", passager.Email);
                    command.Parameters.AddWithValue("Password", pwdHashed);

                    await command.ExecuteNonQueryAsync();

                    // string subject = "Confirmation d'inscription";
                    // string body = "Bonjour " + passager.NomPassager + ",\n\n";
                    // body += "Votre inscription a été confirmée avec succès.";
                    //  using (var message = new MailMessage())
                    // {
                    //     message.From = new MailAddress("karijatsilefilaza@gmail.com"); // Adresse e-mail expéditeur
                    //     message.To.Add(new MailAddress(passager.Email)); // Adresse e-mail du passager
                    //     message.Subject = subject;
                    //     message.Body = body;

                    //     using var smtpClient = new SmtpClient("smtp.example.com"); 
                    //     smtpClient.UseDefaultCredentials = false;
                    //     smtpClient.Credentials = new System.Net.NetworkCredential(passager.Email, passager.Password); // Remplacez par vos propres informations de compte
                    //     smtpClient.EnableSsl = true; // Activez SSL si nécessaire

                    //     smtpClient.Send(message);
                    // }

                    return Ok("Vous êtes inscrit avec succès !");
                }
            }
            catch (Npgsql.NpgsqlException erreur)
            {
                return Ok("Erreur apparait : " + erreur.Message);
            }
        }
        [Route("modification-profil-passager{Id}")]
        [HttpPost]
        public async Task<IActionResult> ProfilModif([FromBody] Passager passager, int Id){
            if(!ModelState.IsValid){

                return BadRequest(ModelState);
            }
            try{
                
                var hasher = new PasswordHasher<Passager>();
                var pwdHashed = hasher.HashPassword(null!, passager.Password);

                string modifProfil = "UPDATE passager SET adressepassager='"+passager.Adressepassager+"', telephone='"+passager.Telephone+"'"+
                ",email= '"+passager.Email+"', password='"+pwdHashed+"' WHERE id="+Id;
                using var connection = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connection.Open();
                using var cmdsql = new NpgsqlCommand(modifProfil, connection);
                await cmdsql.ExecuteNonQueryAsync();

                return Ok("Votre profil est modifié");
            } catch(Npgsql.NpgsqlException e){

                return Ok("Erreur : "+e.Message);
            }
        }
    }
}