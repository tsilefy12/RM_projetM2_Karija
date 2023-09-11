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
            using(var dbC = new AppDbContext())
            {
                using(var connexionDB = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexionDB.Open();
                    using (var command = new NpgsqlCommand(selecVol, connexionDB))
                    {
                        using(var reader = await command.ExecuteReaderAsync())
                        {
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
                    }
                }
            }
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
            using(var dbC = new AppDbContext())
            {
                using (var connexDb = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexDb.Open();
                    using(var command = new NpgsqlCommand(ajoutvol, connexDb))
                    {
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
                }
            }

        }
        [Route("supprimer-vol")]
        [HttpDelete]
        public async Task<IActionResult>  Supprimmer(int id)
        {
            string supprimerVol = "DELETE FROM vol WHERE id=@Id";
            using(var dbC = new AppDbContext())
            {
                using (var connexionDb = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexionDb.Open();
                    using(var command = new NpgsqlCommand(supprimerVol, connexionDb))
                    {
                        command.Parameters.AddWithValue("Id", id);

                        await command.ExecuteNonQueryAsync();

                        return Ok("Un vol est supprimé");
                    }
                }
            }
        }
    }
}
