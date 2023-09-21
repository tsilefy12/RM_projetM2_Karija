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
    public class ReservationController : ControllerBase
    {
        private AppDbContext dbc = new AppDbContext();
        [Route("reserver-vol")]
        [HttpPost]
        public async Task<IActionResult> ReserverVol([FromBody] Reservation reservation)
        {
            if (!ModelState.IsValid)
            {
                ModelState.Remove("$.vol.heureDepart");
                return BadRequest(ModelState);
            }

            try
            {

                string reserverVol = "INSERT INTO reservation(volid, passagerid, tarificationid, libelle, datereservation)" +
                "VALUES(@VolId, @PassagerId, @TarificationId, @Libelle, @DateReservation)";

                using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexiondb.Open();
                using var commandsql = new NpgsqlCommand(reserverVol, connexiondb);

                commandsql.Parameters.AddWithValue("VolId", reservation.VolId);
                commandsql.Parameters.AddWithValue("PassagerId", reservation.PassagerId);
                commandsql.Parameters.AddWithValue("TarificationId", reservation.TarificationId);
                commandsql.Parameters.AddWithValue("Libelle", reservation.Libelle);
                commandsql.Parameters.AddWithValue("DateReservation", reservation.DateReservation);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("Votre réservation est effectuée");
            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return Ok("Erreur : " + erreur.Message);
            }
        }
        [Route("afficher-toutes")]
        [HttpGet]
        public async Task<IActionResult> Afficher(){
            if(!ModelState.IsValid){

                return BadRequest(ModelState);
            }

            try
            {
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                await connexion.OpenAsync();

                string selectresa = "SELECT passager.nompassager, passager.telephone, passager.email, reservation.datereservation, vol.numerovol," +
                    "tarification.prix, tarification.type FROM passager, reservation, vol, tarification WHERE passager.id=reservation.passagerid AND " +
                    " vol.id=reservation.volid AND tarification.id=reservation.tarificationid";

                using var commandsql = new NpgsqlCommand(selectresa, connexion);
                using var reader = await commandsql.ExecuteReaderAsync();
                var result = new List<Reservation>();

                while (await reader.ReadAsync())
                {
                    var reservationDTO = new Reservation
                    {
                        Passager = new Passager
                        {
                            NomPassager = reader.GetString(reader.GetOrdinal("nompassager")),
                            Telephone = reader.GetInt64(reader.GetOrdinal("telephone")),
                            Email = reader.GetString(reader.GetOrdinal("email")),
                        },
                        DateReservation = reader.GetDateTime(reader.GetOrdinal("datereservation")),

                        Vol = new Vol
                        {
                            NumeroVol = reader.GetString(reader.GetOrdinal("numerovol")),
                        },
                        Tarif = new Tarif
                        {
                            Prix = reader.GetDouble(reader.GetOrdinal("prix")),
                            TypeTarif = reader.GetString(reader.GetOrdinal("type")),
                        },
                    };

                    result.Add(reservationDTO);
                }

                return Ok(result);
            }
            catch (Npgsql.NpgsqlException e)
            {
                // Gérer les exceptions spécifiques ici, par exemple, les enregistrer dans des journaux
                return StatusCode(500, "Erreur interne du serveur");
            }
        }
        [Route("recherche-reservation")]
        [HttpGet]
        public async Task<IActionResult> Recherche(string mail)
        {
            try
            {
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                await connexion.OpenAsync();

                string selectresa = "SELECT passager.nompassager, passager.telephone, passager.email, reservation.datereservation, vol.numerovol," +
                    "tarification.prix, tarification.type FROM passager, reservation, vol, tarification WHERE passager.id=reservation.passagerid AND " +
                    " vol.id=reservation.volid AND tarification.id=reservation.tarificationid AND passager.email='" + mail + "'";

                using var commandsql = new NpgsqlCommand(selectresa, connexion);
                using var reader = await commandsql.ExecuteReaderAsync();
                var result = new List<Reservation>();

                while (await reader.ReadAsync())
                {
                    var reservationDTO = new Reservation
                    {
                        Passager = new Passager
                        {
                            NomPassager = reader.GetString(reader.GetOrdinal("nompassager")),
                            Telephone = reader.GetInt64(reader.GetOrdinal("telephone")),
                            Email = reader.GetString(reader.GetOrdinal("email")),
                        },
                        DateReservation = reader.GetDateTime(reader.GetOrdinal("datereservation")),

                        Vol = new Vol
                        {
                            NumeroVol = reader.GetString(reader.GetOrdinal("numerovol")),
                        },
                        Tarif = new Tarif
                        {
                            Prix = reader.GetDouble(reader.GetOrdinal("prix")),
                            TypeTarif = reader.GetString(reader.GetOrdinal("type")),
                        },
                    };

                    result.Add(reservationDTO);
                }

                return Ok(result);
            }
            catch (Npgsql.NpgsqlException e)
            {
                // Gérer les exceptions spécifiques ici, par exemple, les enregistrer dans des journaux
                return StatusCode(500, "Erreur interne du serveur");
            }
        }

    }
}