using apiWebCore.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration.UserSecrets;
using Npgsql;
using PostgreSQLAPI.Models;
using System.Data;
using System.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace apiWebCore.Controllers
{
    [Route("api/[controller]")]
    public class AvionController : Controller
    {
        //ceci est un affichage de tous les avions enrégistrés dans la base de données
        [HttpGet]
        public IEnumerable<Avion> Get()
        {
            using (var db = new AppDbContext())
            {
                var avions = db.Avions.OrderBy(p => p.NumeroAvion);
                return avions.ToList();
            }

        }

        //code pour l'ajout d'avion
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Avion model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            int cpt = model.Capacite;
            string sql = "INSERT INTO avion (numavion, modelavion, capacite) VALUES (@NumeroAvion, @ModelAvion, @Capacite)";
            using (var db = new AppDbContext())
            {
                using (var connection = new NpgsqlConnection(db.Database.GetConnectionString()))

                {
                    connection.Open();

                    using (var command = new NpgsqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("NumeroAvion", model.NumeroAvion);
                        command.Parameters.AddWithValue("ModelAvion", model.ModelAvion);
                        command.Parameters.AddWithValue("Capacite", cpt);

                        // Ajoutez d'autres paramètres si nécessaire

                        await command.ExecuteNonQueryAsync();

                    }
                }
            }

            return Ok("Insertion réussie");

        }

        //code pour le recherche de l'avion
        [HttpGet("recherche")]
        public async Task<IActionResult> Search([FromQuery] Avion recherche)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var dbC = new AppDbContext())
            {
                var query = dbC.Avions.AsQueryable();

                if (!string.IsNullOrEmpty(recherche.NumeroAvion))
                {
                    query = query.Where(avion => avion.NumeroAvion.Contains(recherche.NumeroAvion));
                }

                else if (!string.IsNullOrEmpty(recherche.ModelAvion))
                {
                    query = query.Where(avion => avion.ModelAvion.Contains(recherche.ModelAvion));
                }
                else
                {
                    query = query.Where(avion => avion.Capacite.ToString().Contains(recherche.Capacite.ToString()));
                }

                var result = await query.ToListAsync();
                return Ok(result);
            }
        }

        //ceci est code pour affciher un avion qu'on veut éditer avant la modification
        [HttpGet("editer")]
        public async Task<IActionResult> Edit(int Id)
        {
            try
            {
                using var dbC = new AppDbContext();
                string select = "SELECT * FROM avion WHERE id=@Id";

                using NpgsqlConnection conex = new NpgsqlConnection(dbC.Database.GetConnectionString());
                await conex.OpenAsync();

                using NpgsqlCommand cmd = new NpgsqlCommand(select, conex);
                cmd.Parameters.AddWithValue("Id", Id);

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    // Récupérez les données de la base de données
                    int id = reader.GetInt32(reader.GetOrdinal("id"));
                    string numeroAvion = reader.GetString(reader.GetOrdinal("numavion"));
                    string model = reader.GetString(reader.GetOrdinal("modelavion"));
                    int capacite = reader.GetInt32(reader.GetOrdinal("capacite"));
                    Console.WriteLine("id = " + id);
                    var avion = new Avion
                    {
                        Id = id,
                        NumeroAvion = numeroAvion,
                        ModelAvion = model,
                        Capacite = capacite
                    };

                    // Retournez les données de l'avion en réponse HTTP
                    return Ok(avion);
                }
                else
                {
                    return NotFound("Aucun avion trouvé avec l'ID spécifié.");
                }
            }
            catch (Exception ex)
            {
                // Gérez les exceptions appropriées ici
                return StatusCode(500, "Une erreur s'est produite lors de la récupération des données : " + ex.Message);
            }
        }

        //fonction pour la modification d'un avion
        [HttpPost("modification")]
        public async Task<IActionResult> UpdateAvion([FromBody] Avion model, int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            using (var db = new AppDbContext())
            {
                string modifierAvion = "UPDATE avion SET modelavion=@ModelAvion, capacite=@Capacite WHERE id=@Id";
                using (NpgsqlConnection con = new NpgsqlConnection(db.Database.GetConnectionString()))
                {
                    con.Open();
                    using (NpgsqlCommand commande = new NpgsqlCommand(modifierAvion, con))
                    {
                        if (string.IsNullOrEmpty(model.ModelAvion))
                        {
                            return BadRequest("Le modèle ne peut pas être vide");
                        }

                        commande.Parameters.AddWithValue("Id", Id);
                        commande.Parameters.AddWithValue("ModelAvion", model.ModelAvion);
                        commande.Parameters.AddWithValue("Capacite", model.Capacite);
                        await commande.ExecuteNonQueryAsync();
                    }
                }
            }
            return Ok("Modification succès!!");
        }

        //ceci est un code pour supprimmer un avion à  l'aide de son numéro(identifiant)

        [HttpDelete]
        [HttpGet("numavion")]
        public async Task<IActionResult> Delete(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            using (var dbC = new AppDbContext())
            {
                string deleteAvion = "DELETE FROM avion WHERE id=@Id";
                using (NpgsqlConnection connexion = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexion.Open();
                    using (NpgsqlCommand cmd = new NpgsqlCommand(deleteAvion, connexion))
                    {
                        cmd.Parameters.AddWithValue("Id", Id);
                        await cmd.ExecuteNonQueryAsync();
                    }
                }
            }
            return Ok("Vous avez suppimé  un avion");
        }
    }
}