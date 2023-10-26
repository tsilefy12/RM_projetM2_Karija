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
        public class ReservationData
        {
            public List<Passager> Passagers { get; set; }
            public List<Reservation> Reservations { get; set; }
            public List<Vol> Vols { get; set; }
            public List<Tarif> Tarifs { get; set; }
        }

        [Route("afficher-toutes")]
        [HttpGet]
        public async Task<IActionResult> afficher()
        {
            try
            {
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                await connexion.OpenAsync();

                string selectresa = "SELECT passager.id,reservation.passagerid, passager.nompassager, passager.telephone, passager.email, reservation.datereservation, vol.numerovol," +
                    "tarification.prix, tarification.type FROM passager, reservation, vol, tarification WHERE passager.id=reservation.passagerid AND " +
                    " vol.id=reservation.volid AND tarification.id=reservation.tarificationid";

                using var commandsql = new NpgsqlCommand(selectresa, connexion);
                using var reader = await commandsql.ExecuteReaderAsync();
                var resultatRecherche = new ResultatRecherche
                {
                    Passagers = new List<Passager>(),
                    Reservations = new List<Reservation>(),
                    Vols = new List<Vol>(),
                    Tarifs = new List<Tarif>()
                };

                while (await reader.ReadAsync())
                {
                    var passager = new Passager
                    {
                        IdPassager = reader.GetInt32(reader.GetOrdinal("id")),
                        NomPassager = reader.GetString(reader.GetOrdinal("nompassager")),
                        Telephone = reader.GetInt64(reader.GetOrdinal("telephone")),
                        Email = reader.GetString(reader.GetOrdinal("email")),
                    };
                    resultatRecherche.Passagers.Add(passager);

                    var reservation = new Reservation
                    {
                        PassagerId = reader.GetInt32(reader.GetOrdinal("passagerid")),
                        DateReservation = reader.GetDateTime(reader.GetOrdinal("datereservation")),
                    };
                    resultatRecherche.Reservations.Add(reservation);

                    var vol = new Vol
                    {
                        NumeroVol = reader.GetString(reader.GetOrdinal("numerovol")),
                    };
                    resultatRecherche.Vols.Add(vol);

                    var tarif = new Tarif
                    {
                        Prix = reader.GetDouble(reader.GetOrdinal("prix")),
                        TypeTarif = reader.GetString(reader.GetOrdinal("type")),
                    };
                    resultatRecherche.Tarifs.Add(tarif);
                   continue;
                }
                return Ok(resultatRecherche);
            }
            catch (Npgsql.NpgsqlException e)
            {
                return StatusCode(500, "Erreur interne du serveur" + e.Message);
            }
        }
        [Route("recherche-reservation/{NumeroVol}")]
        [HttpGet]
        public async Task<IActionResult> Recherche(string NumeroVol)
        {
            try
            {
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                await connexion.OpenAsync();

                string selectresa = "SELECT passager.id,reservation.passagerid, passager.nompassager, passager.telephone, passager.email, reservation.datereservation, vol.numerovol," +
                    "tarification.prix, tarification.type FROM passager, reservation, vol, tarification WHERE passager.id=reservation.passagerid AND " +
                    " vol.id=reservation.volid AND tarification.id=reservation.tarificationid AND vol.numerovol like '%"+NumeroVol+"%'";

                using var commandsql = new NpgsqlCommand(selectresa, connexion);
                using var reader = await commandsql.ExecuteReaderAsync();
                var resultatRecherche = new ResultatRecherche
                {
                    Passagers = new List<Passager>(),
                    Reservations = new List<Reservation>(),
                    Vols = new List<Vol>(),
                    Tarifs = new List<Tarif>()
                };

                while (await reader.ReadAsync())
                {
                    var passager = new Passager
                    {
                        IdPassager = reader.GetInt32(reader.GetOrdinal("id")),
                        NomPassager = reader.GetString(reader.GetOrdinal("nompassager")),
                        Telephone = reader.GetInt64(reader.GetOrdinal("telephone")),
                        Email = reader.GetString(reader.GetOrdinal("email")),
                    };
                    resultatRecherche.Passagers.Add(passager);

                    var reservation = new Reservation
                    {
                        PassagerId = reader.GetInt32(reader.GetOrdinal("passagerid")),
                        DateReservation = reader.GetDateTime(reader.GetOrdinal("datereservation")),
                    };
                    resultatRecherche.Reservations.Add(reservation);

                    var vol = new Vol
                    {
                        NumeroVol = reader.GetString(reader.GetOrdinal("numerovol")),
                    };
                    resultatRecherche.Vols.Add(vol);

                    var tarif = new Tarif
                    {
                        Prix = reader.GetDouble(reader.GetOrdinal("prix")),
                        TypeTarif = reader.GetString(reader.GetOrdinal("type")),
                    };
                    resultatRecherche.Tarifs.Add(tarif);
                }

                return Ok(resultatRecherche);
            }
            catch (Npgsql.NpgsqlException e)
            {
                return StatusCode(500, "Erreur interne du serveur" + e.Message);
            }
        }
        [Route("vider-reservation")]
        [HttpDelete]
        public async Task<IActionResult> Vider(int num)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }

            try
            {
                using var connex = new NpgsqlConnection(dbc.Database.GetConnectionString());

                string verifierVolIdd = "SELECT volid FROM reservation WHERE volid = " + num;

                connex.Open();
                using var commandVerify = new NpgsqlCommand(verifierVolIdd, connex);

                var reader = await commandVerify.ExecuteReaderAsync();
                int list = 0;
                if (await reader.ReadAsync())
                {
                    int idvol = reader.GetInt32(reader.GetOrdinal("volid"));
                    list = idvol;
                }
                reader.Close();
                // Console.WriteLine(list);
                if (list == num)
                {
                    string vider = "DELETE FROM reservation WHERE volid='" + num + "'";
                    using var cmd = new NpgsqlCommand(vider, connex);

                    await cmd.ExecuteNonQueryAsync();

                    return Ok("Toutes les réservations avec le numéro vol ='" + num + "' sont supprimé");

                }
                else
                {

                    return Ok("Aucun passager fait la réservation avec le vol numéro = '" + num + "'");
                }
            }
            catch (Npgsql.NpgsqlException e)
            {

                return StatusCode(500, "Erreur : " + e.Message);
            }
        }
        [Route("supprimer-reservation/{IdP}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteResa(int IdP)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }

            try
            {

                string supprimer = "DELETE FROM reservation WHERE passagerid=" + IdP;

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(supprimer, connexion);

                var test = await commandsql.ExecuteNonQueryAsync();
                if (test == 1)
                {

                    return Ok("La réservation du passager ayant le numéro '" + IdP + "' est supprimée.");
                }
                return Ok("Attentio, vous avez rencontré un problème avec la suppression!");
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("Erreur : " + e.Message);
            }
        }
    }
}