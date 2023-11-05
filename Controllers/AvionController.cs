using apiWebCore.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration.UserSecrets;
using Npgsql;
using PostgreSQLAPI.Models;
using System.ComponentModel.DataAnnotations;
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
            using var db = new AppDbContext();
            var avions = db.Avions.OrderBy(p => p.Id);
            return avions.ToList();

        }

        //code pour l'ajout d'avion
        [Route("Ajout-avion")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Avion model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                using var db = new AppDbContext();
                using var connexion = new NpgsqlConnection(db.Database.GetConnectionString());

                string verifierAvion = "SELECT numavion FROM avion WHERE numavion='" + model.NumeroAvion + "'";
                connexion.Open();
                using var cmdverify = new NpgsqlCommand(verifierAvion, connexion);

                var reader = await cmdverify.ExecuteReaderAsync();

                var numavion = "";
                if (await reader.ReadAsync())
                {
                    string numero = reader.GetString(reader.GetOrdinal("numavion"));
                    numavion = numero;
                }
                Console.WriteLine("numero avion " + numavion);
                reader.Close();
                if (numavion == model.NumeroAvion)
                {
                    return Ok("Avion déjà existé dans la base de données.");
                }
                else
                {
                    int cpt = model.Capacite;
                    string sql = "INSERT INTO avion (numavion, modelavion, capacite) VALUES (@NumeroAvion, @ModelAvion, @Capacite)";
                    using var connection = new NpgsqlConnection(db.Database.GetConnectionString());
                    connection.Open();

                    using var command = new NpgsqlCommand(sql, connection);
                    command.Parameters.AddWithValue("NumeroAvion", model.NumeroAvion);
                    command.Parameters.AddWithValue("ModelAvion", model.ModelAvion);
                    command.Parameters.AddWithValue("Capacite", cpt);

                    // Ajoutez d'autres paramètres si nécessaire

                    await command.ExecuteNonQueryAsync();
                    return Ok("Avion enregistré dans la base de données.");
                }
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("Erreur " + e.Message);
            }

        }

        //code pour le recherche de l'avion
        [Route("recherche-avion/{Recherche}")]
        [HttpGet]
        public async Task<IActionResult> Search(string Recherche)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                using var db = new AppDbContext();
                var test = Recherche.ToLower();
                string search = "SELECT * FROM avion WHERE numavion LIKE '%" + test + "%' OR modelavion LIKE '%" + test + "%'";
                using var connexionbase = new NpgsqlConnection(db.Database.GetConnectionString());
                connexionbase.Open();
                using var commandsql = new NpgsqlCommand(search, connexionbase);

                var reader = await commandsql.ExecuteReaderAsync();

                var listRecherche = new List<Avion>();

                while (await reader.ReadAsync())
                {
                    int id = reader.GetInt32(reader.GetOrdinal("id"));
                    string num = reader.GetString(reader.GetOrdinal("numavion"));
                    string model = reader.GetString(reader.GetOrdinal("modelavion"));
                    int capacite = reader.GetInt32(reader.GetOrdinal("capacite"));
                    var avion = new Avion
                    {
                        Id = id,
                        NumeroAvion = num,
                        ModelAvion = model,
                        Capacite = capacite,
                    };
                    listRecherche.Add(avion);
                    continue;
                }
                return Ok(listRecherche);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("Erreur : " + e.Message);
            }
        }

        //ceci est code pour affciher un avion qu'on veut éditer avant la modification
        [Route("edit-avion/{Id}")]
        [HttpGet]
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
        [Route("modification-avion/{Id}")]
        [HttpPost]
        public async Task<IActionResult> UpdateAvion([FromBody] Avion model, int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            using (var db = new AppDbContext())
            {
                string modifierAvion = "UPDATE avion SET modelavion=@ModelAvion, capacite=@Capacite WHERE id=@Id";
                using NpgsqlConnection con = new NpgsqlConnection(db.Database.GetConnectionString());
                con.Open();
                using NpgsqlCommand commande = new NpgsqlCommand(modifierAvion, con);
                if (string.IsNullOrEmpty(model.ModelAvion))
                {
                    return BadRequest("Le modèle ne peut pas être vide");
                }

                commande.Parameters.AddWithValue("Id", Id);
                commande.Parameters.AddWithValue("ModelAvion", model.ModelAvion);
                commande.Parameters.AddWithValue("Capacite", model.Capacite);
                await commande.ExecuteNonQueryAsync();
            }
            return Ok("Modification succès!!");
        }

        //ceci est un code pour supprimmer un avion à  l'aide de son numéro(identifiant)
        [Route("suppression-avion/{Id}")]
        [HttpDelete]
        public async Task<IActionResult> Delete(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            using (var dbC = new AppDbContext())
            {
                string selectIdvol = "SELECT volid FROM reservation, vol, avion WHERE avion.id=vol.avionid AND vol.id=reservation.volid AND avion.id =" + Id;
                using var conn = new NpgsqlConnection(dbC.Database.GetConnectionString());
                conn.Open();
                using var cmd = new NpgsqlCommand(selectIdvol, conn);
                var reader = await cmd.ExecuteReaderAsync();

                int idvolresa = 0;
                while (await reader.ReadAsync())
                {
                    int resavolid = reader.GetInt32(reader.GetOrdinal("volid"));
                    idvolresa = resavolid;
                }
                Console.WriteLine("id " + idvolresa);
                if (idvolresa == 0)
                {
                    string deleteVol = "DELETE FROM vol WHERE avionid=" + Id;
                    string deleteAvion = "DELETE FROM avion WHERE id=" + Id;
                    using NpgsqlConnection connexion = new NpgsqlConnection(dbC.Database.GetConnectionString());
                    connexion.Open();
                    using var command = new NpgsqlCommand(deleteVol, connexion);
                    await command.ExecuteNonQueryAsync();
                    using var cmdsql = new NpgsqlCommand(deleteAvion, connexion);
                    await cmdsql.ExecuteNonQueryAsync();
                    return Ok("Vous avez suppimé  un avion aucune réservation");
                }
                else
                {
                    string deleteResa = "DELETE FROM reservation WHERE volid="+idvolresa;
                    string deleteVol = "DELETE FROM vol WHERE avionid=" + Id;
                    string deleteAvion = "DELETE FROM avion WHERE id=" + Id;

                    using NpgsqlConnection connexion = new NpgsqlConnection(dbC.Database.GetConnectionString());
                    connexion.Open();

                    using var commandsql = new NpgsqlCommand(deleteResa, connexion);
                    await commandsql.ExecuteNonQueryAsync();

                    using var command = new NpgsqlCommand(deleteVol, connexion);
                    await command.ExecuteNonQueryAsync();

                    using var commandesql = new NpgsqlCommand(deleteAvion, connexion);
                    await commandesql.ExecuteNonQueryAsync();
                    return Ok("Vous avez suppimé  un avion déjà réservé par passager");
                }
            }
           
        }
        [Route("num-avion")]
        [HttpGet]
        public async Task<IActionResult> Numero()
        {
            using var db = new AppDbContext();
            using var connexion = new NpgsqlConnection(db.Database.GetConnectionString());

            string verifierAvion = "SELECT id FROM avion ORDER BY id";
            connexion.Open();
            using var cmdverify = new NpgsqlCommand(verifierAvion, connexion);

            var reader = await cmdverify.ExecuteReaderAsync();

            var numavion = new List<Avion>();
            while (await reader.ReadAsync())
            {
                int numero = reader.GetInt32(reader.GetOrdinal("id"));
                var num = new Avion
                {
                    Id = numero
                };
                numavion.Add(num);
                continue;
            }
            return Ok(numavion);
        }
        [Route("num-avion/{Id}")]
        [HttpGet]
        public async Task<IActionResult> Numero(int Id)
        {
            using var db = new AppDbContext();
            using var connexion = new NpgsqlConnection(db.Database.GetConnectionString());

            string verifierAvion = "SELECT capacite FROM avion where id ='" + Id + "'";
            connexion.Open();
            using var cmdverify = new NpgsqlCommand(verifierAvion, connexion);

            var reader = await cmdverify.ExecuteReaderAsync();

            var numavion = new List<Avion>();
            while (await reader.ReadAsync())
            {
                int capacite = reader.GetInt32(reader.GetOrdinal("capacite"));
                var num = new Avion
                {
                    Capacite = capacite
                };
                numavion.Add(num);
                continue;
            }
            return Ok(numavion);
        }
    }
}