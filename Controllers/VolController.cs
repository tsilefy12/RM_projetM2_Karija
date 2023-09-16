using apiWebCore.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using PostgreSQLAPI.Models;
using System.Data;

namespace apiWebCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolController : Controller
    {
        [HttpGet]
        public async Task<IActionResult> AfficherVols()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string selecVol = "SELECT * FROM vol";
            using var dbC = new AppDbContext();
            using var connexionDB = new NpgsqlConnection(dbC.Database.GetConnectionString());
            connexionDB.Open();
            using var command = new NpgsqlCommand(selecVol, connexionDB);
            using var reader = await command.ExecuteReaderAsync();
            List<Vol> ListVol = new List<Vol>();

            while (await reader.ReadAsync())
            {
                int id = reader.GetInt32(reader.GetOrdinal("id"));
                int avionid = reader.GetInt32(reader.GetOrdinal("avionid"));
                string numerovol = reader.GetString(reader.GetOrdinal("numerovol"));
                DateTime datedepart = reader.GetDateTime(reader.GetOrdinal("datedepart"));
                TimeSpan heuredepart = reader.GetTimeSpan(reader.GetOrdinal("heuredepart"));
                int capacitemax = reader.GetInt32(reader.GetOrdinal("capacitemax"));
                string lieudepart = reader.GetString(reader.GetOrdinal("lieudepart"));
                string lieuarrivee = reader.GetString(reader.GetOrdinal("lieuarrivee"));

                var vols = new Vol
                {
                    Id = id,
                    AvionId = avionid,
                    NumeroVol = numerovol,
                    DateDepart = datedepart,
                    HeureDepart = heuredepart,
                    CapaciteMax = capacitemax,
                    LieuDepart = lieudepart,
                    LieuArrivee = lieuarrivee,
                };
                ListVol.Add(vols);
                continue;
            }
            return Ok(ListVol);
        }
        [Route("ajout-vol")]
        [HttpPost]
        public async Task<IActionResult> Ajout([FromBody] Vol vol)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string ajoutvol = "INSERT INTO vol(avionid, numerovol, datedepart,heuredepart, capacitemax, lieudepart, lieuarrivee)" +
                " VALUES(@AvionId, @NumeroVol, @DateDepart,@HeureDepart,@CapaciteMax, @LieuDepart, @LieuArrivee)";
            using var dbC = new AppDbContext();
            using var connexDb = new NpgsqlConnection(dbC.Database.GetConnectionString());
            try
            {
                connexDb.Open();
                using var command = new NpgsqlCommand(ajoutvol, connexDb);
                command.Parameters.AddWithValue("AvionId", vol.AvionId);
                command.Parameters.AddWithValue("NumeroVol", vol.NumeroVol);
                command.Parameters.AddWithValue("DateDepart", vol.DateDepart);
                command.Parameters.AddWithValue("HeureDepart", vol.HeureDepart);
                command.Parameters.AddWithValue("CapaciteMax", vol.CapaciteMax);
                command.Parameters.AddWithValue("LieuDepart", vol.LieuDepart);
                command.Parameters.AddWithValue("LieuArrivee", vol.LieuArrivee);

                await command.ExecuteNonQueryAsync();

                return Ok("ajout vol a réuissi");
            }
            catch (Npgsql.PostgresException e)
            {
                if (e.SqlState == "23503")
                {
                    return BadRequest("Le numéro " + "'" + vol.AvionId + "'" + "n'existe pas dans la table avion.");
                }
                else
                {
                    return BadRequest("Une erreur s'est produite lors de la requête : " + e.Message);
                }
            }
        }
        [Route("supprimer-vol")]
        [HttpDelete]
        public async Task<IActionResult> Supprimmer(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string supprimerVol = "DELETE FROM vol WHERE id=@Id";
            using var dbC = new AppDbContext();
            using var connexionDb = new NpgsqlConnection(dbC.Database.GetConnectionString());
            connexionDb.Open();
            using var command = new NpgsqlCommand(supprimerVol, connexionDb);
            command.Parameters.AddWithValue("Id", id);

            await command.ExecuteNonQueryAsync();
            var e = new Npgsql.NpgsqlException();
            if (e.SqlState != "200")
            {
                return BadRequest("La suppression est échouée");
            }
            else
            {
                return Ok("Un vol est supprimé");
            }
        }
        [Route("recherche")]
        [HttpGet]
        public async Task<IActionResult> RechercheVol(string LieuDepart, string LieuArrivee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string rechercheVol = "SELECT * FROM vol WHERE lieudepart LIKE @LieuDepart AND lieuarrivee LIKE @LieuArrivee";
            using (var dbC = new AppDbContext())
            {
                using (var connexiondb = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexiondb.Open();
                    using (var command = new NpgsqlCommand(rechercheVol, connexiondb))
                    {
                        command.Parameters.AddWithValue("LieuDepart", "%" + LieuDepart + "%");
                        command.Parameters.AddWithValue("LieuArrivee", "%" + LieuArrivee + "%");

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            List<Vol> ListRechercheVol = new List<Vol>();
                            while (await reader.ReadAsync())
                            {
                                int id = reader.GetInt32(reader.GetOrdinal("id"));
                                int avionid = reader.GetInt32(reader.GetOrdinal("avionid"));
                                string numerovol = reader.GetString(reader.GetOrdinal("numerovol"));
                                DateTime datedepart = reader.GetDateTime(reader.GetOrdinal("datedepart"));
                                TimeSpan heuredepart = reader.GetTimeSpan(reader.GetOrdinal("heuredepart"));
                                int capacitemax = reader.GetInt32(reader.GetOrdinal("capacitemax"));
                                string lieudepart = reader.GetString(reader.GetOrdinal("lieudepart"));
                                string lieuarrivee = reader.GetString(reader.GetOrdinal("lieuarrivee"));

                                var volsResulat = new Vol
                                {
                                    Id = id,
                                    AvionId = avionid,
                                    NumeroVol = numerovol,
                                    DateDepart = datedepart,
                                    HeureDepart = heuredepart,
                                    CapaciteMax = capacitemax,
                                    LieuDepart = lieudepart,
                                    LieuArrivee = lieuarrivee,

                                };
                                ListRechercheVol.Add(volsResulat);
                                continue;
                            }
                            return Ok(ListRechercheVol);
                        }

                    }
                }
            }
        }
        [Route("edit-vol/{Id}")]
        [HttpGet]
        public async Task<IActionResult> EditVol(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string edit = "SELECT * FROM vol WHERE id=@Id";
            using (var dbC = new AppDbContext())
            {
                using (var connexiondb = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexiondb.Open();
                    using (var command = new NpgsqlCommand(edit, connexiondb))
                    {
                        command.Parameters.AddWithValue("Id", Id);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            List<Vol> ListEditVol = new List<Vol>();
                            if (await reader.ReadAsync())
                            {
                                int id = reader.GetInt32(reader.GetOrdinal("id"));
                                int avionid = reader.GetInt32(reader.GetOrdinal("avionid"));
                                string numerovol = reader.GetString(reader.GetOrdinal("numerovol"));
                                DateTime datedepart = reader.GetDateTime(reader.GetOrdinal("datedepart"));
                                TimeSpan heuredepart = reader.GetTimeSpan(reader.GetOrdinal("heuredepart"));
                                int capacitemax = reader.GetInt32(reader.GetOrdinal("capacitemax"));
                                string lieudepart = reader.GetString(reader.GetOrdinal("lieudepart"));
                                string lieuarrivee = reader.GetString(reader.GetOrdinal("lieuarrivee"));

                                var volsResulat = new Vol
                                {
                                    Id = id,
                                    AvionId = avionid,
                                    NumeroVol = numerovol,
                                    DateDepart = datedepart,
                                    HeureDepart = heuredepart,
                                    CapaciteMax = capacitemax,
                                    LieuDepart = lieudepart,
                                    LieuArrivee = lieuarrivee,

                                };
                                ListEditVol.Add(volsResulat);
                            }
                            return Ok(ListEditVol);
                        }
                    }
                }
            }
        }
        [Route("modification-vol/{Id}")]
        [HttpPost]
        public async Task<IActionResult> ModificationVol([FromBody] Vol vol, int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                try
                {
                    string modification = "UPDATE vol SET datedepart=@DateDepart, heuredepart=@HeureDepart, lieudepart=@LieuDepart, lieuarrivee=@LieuArrivee WHERE id = @Id";
                    using (var dbC = new AppDbContext())
                    {
                        using var connexiondb = new NpgsqlConnection(dbC.Database.GetConnectionString());
                        connexiondb.Open();
                        using var command = new NpgsqlCommand(modification, connexiondb);
                        command.Parameters.AddWithValue("Id", Id);
                        command.Parameters.AddWithValue("DateDepart", vol.DateDepart);
                        command.Parameters.AddWithValue("HeureDepart", vol.HeureDepart);
                        command.Parameters.AddWithValue("LieuDepart", vol.LieuDepart);
                        command.Parameters.AddWithValue("LieuArrivee", vol.LieuArrivee);

                        await command.ExecuteNonQueryAsync();
                    }
                    return Ok("Modification est succès.");
                } catch(Npgsql.NpgsqlException e){
                    return Ok("Une erreur apparait : "+ e.Message);
                }
            }

        }
    }
}
