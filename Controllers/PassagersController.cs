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

        public async Task<IActionResult> Affichage(string Email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                try
                {
                    string selectPassagers = "select * from passager where email='"+Email+"'";

                    using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                    connexiondb.Open();
                    using var commandsql = new NpgsqlCommand(selectPassagers, connexiondb);

                    using var reader = await commandsql.ExecuteReaderAsync();

                    var listPassagers = new List<Passager>();

                    while (await reader.ReadAsync())
                    {

                        var passagers = new Passager
                        {
                            IdPassager = reader.GetInt32(reader.GetOrdinal("id")),
                            NomPassager = reader.GetString(reader.GetOrdinal("nompassager")),
                            Adressepassager = reader.GetString(reader.GetOrdinal("adressepassager")),
                            Telephone = reader.GetInt64(reader.GetOrdinal("telephone")),
                            Email = reader.GetString(reader.GetOrdinal("email")),
                            Password = reader.GetString(reader.GetOrdinal("password")),
                            TypeClient = reader.GetString(reader.GetOrdinal("typeclient")),
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
                    string inscriptionPassager = "INSERT INTO passager(nompassager, adressepassager, telephone, email, password, typeclient)" +
                    "VALUES(@NomPassager, @AdressePassager, @Telephone, @Email, @Password, 'client')";
                    using var command = new NpgsqlCommand(inscriptionPassager, connexiondb);
                    string mdp = passager.Password;

                    byte[] encData_byte = new byte[mdp.Length];
                    encData_byte = System.Text.Encoding.UTF8.GetBytes(mdp);
                    string encodedData = Convert.ToBase64String(encData_byte);
      
                    command.Parameters.AddWithValue("NomPassager", passager.NomPassager);
                    command.Parameters.AddWithValue("AdressePassager", passager.Adressepassager);
                    command.Parameters.AddWithValue("Telephone", passager.Telephone);
                    command.Parameters.AddWithValue("Email", passager.Email);
                    command.Parameters.AddWithValue("Password", encodedData);
                    // command.Parameters.AddWithValue("typeClient", passager.TypeClient);

                    await command.ExecuteNonQueryAsync();

                    return Ok("Vous êtes inscrit avec succès !");
                }
            }
            catch (Npgsql.NpgsqlException erreur)
            {
                return Ok("Erreur apparait : " + erreur.Message);
            }
        }
        [Route("modification-profil-passager/{Id}")]
        [HttpPost]
        public async Task<IActionResult> ProfilModif([FromBody] Passager passager, int Id)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }
            try
            {

                var hasher = new PasswordHasher<Passager>();
                var pwdHashed = hasher.HashPassword(null!, passager.Password);

                string modifProfil = "UPDATE passager SET email='" + passager.Email + "', telephone='" + passager.Telephone + "'," +
                " adressepassager = '" + passager.Adressepassager + "' WHERE id=" + Id;
                using var connection = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connection.Open();
                using var cmdsql = new NpgsqlCommand(modifProfil, connection);
                await cmdsql.ExecuteNonQueryAsync();

                return Ok("Votre profil est modifié");
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("Erreur : " + e.Message);
            }
        }
        [Route("edit-mail/{Id}")]
        [HttpGet]
        public async Task<IActionResult> EditMail(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string editmail = "SELECT email FROM passager WHERE id =" + Id;

                using var connection = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connection.Open();
                using var command = new NpgsqlCommand(editmail, connection);

                var reader = await command.ExecuteReaderAsync();

                var listeMail = new List<Passager>();

                while (await reader.ReadAsync())
                {
                    var adresseMail = new Passager
                    {
                        Email = reader.GetString(reader.GetOrdinal("email")),
                    };
                    listeMail.Add(adresseMail);
                }
                return Ok(listeMail);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("erreur :" + e.Message);
            }
        }
        [Route("edit-Phone/{Id}")]
        [HttpGet]
        public async Task<IActionResult> EditPhone(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string editphone = "SELECT telephone FROM passager WHERE id =" + Id;

                using var connection = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connection.Open();
                using var command = new NpgsqlCommand(editphone, connection);

                var reader = await command.ExecuteReaderAsync();

                var listePhone = new List<Passager>();

                while (await reader.ReadAsync())
                {
                    var phone = new Passager
                    {
                        Telephone = reader.GetInt64(reader.GetOrdinal("telephone")),
                    };
                    listePhone.Add(phone);
                }
                return Ok(listePhone);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("erreur :" + e.Message);
            }
        }
        [Route("edit-adresse/{Id}")]
        [HttpGet]
        public async Task<IActionResult> EditAdresse(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string editphone = "SELECT adressepassager FROM passager WHERE id =" + Id;

                using var connection = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connection.Open();
                using var command = new NpgsqlCommand(editphone, connection);

                var reader = await command.ExecuteReaderAsync();

                var listePhone = new List<Passager>();

                while (await reader.ReadAsync())
                {
                    var phone = new Passager
                    {
                        Adressepassager = reader.GetString(reader.GetOrdinal("adressepassager")),
                    };
                    listePhone.Add(phone);
                }
                return Ok(listePhone);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("erreur :" + e.Message);
            }
        }
        [Route("login")]
        [HttpGet]
        public async Task<IActionResult> Log(string mail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string selectMailPassword = "SELECT email, password, typeclient, id FROM passager WHERE email = '" + mail + "'";
                using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexiondb.Open();
                using var commandsql = new NpgsqlCommand(selectMailPassword, connexiondb);

                var reader = await commandsql.ExecuteReaderAsync();
                var liste = new List<Passager>();

                while (await reader.ReadAsync())
                {

                    string mot = reader.GetString(reader.GetOrdinal("password"));
                    System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
                    System.Text.Decoder utf8Decode = encoder.GetDecoder();
                    byte[] todecode_byte = Convert.FromBase64String(mot);
                    int charCount = utf8Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
                    char[] decoded_char = new char[charCount];
                    utf8Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
                    string result = new String(decoded_char);
                    var log = new Passager
                    {
                        Email = reader.GetString(reader.GetOrdinal("email")),
                        Password = result,
                        TypeClient = reader.GetString(reader.GetOrdinal("typeclient")),
                        IdPassager = reader.GetInt32(reader.GetOrdinal("id")),
                    };
                    liste.Add(log);
                }
                return Ok(liste);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return BadRequest("erreur :" + e.Message);
            }
        }
    }
}