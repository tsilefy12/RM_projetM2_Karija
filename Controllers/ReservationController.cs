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
                string selectTarif = "SELECT nombreplacedispotarif FROM tarification WHERE id ='" + reservation.TarificationId + "'";
                using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexiondb.Open();
                using var cmd = new NpgsqlCommand(selectTarif, connexiondb);
                var readT = await cmd.ExecuteReaderAsync();
                var tar = 0;
                if (await readT.ReadAsync())
                {
                    int x = readT.GetInt32(readT.GetOrdinal("nombreplacedispotarif"));
                    tar = x;
                }
                string selectCapaciteVol = "SELECT capacitemax FROM vol WHERE id ='"+reservation.VolId+"'";
                using var connection = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connection.Open();
                using var cmdVol = new NpgsqlCommand(selectCapaciteVol, connection);
                var readCv = await cmdVol.ExecuteReaderAsync();
                var Cap = 0;
                if (await readCv.ReadAsync())
                {
                    int c= readCv.GetInt32(readCv.GetOrdinal("capacitemax"));
                    Cap = c;
                }
                string daty = "SELECT vol.datedepart, reservation.volid, reservation.passagerid FROM vol, reservation, passager WHERE vol.id=reservation.volid AND passager.id=reservation.passagerid AND "+
                " reservation.volid ='"+reservation.VolId+"' AND reservation.passagerid='"+reservation.PassagerId+"'";
                using var condate = new NpgsqlConnection(dbc.Database.GetConnectionString());
                condate.Open();
                using var cmddate = new NpgsqlCommand(daty, condate);
                var readdate = await cmddate.ExecuteReaderAsync();
                var datee ="";
                var idv = 0;
                var i=0;
                if (await readdate.ReadAsync())
                {
                    DateTime datyy = readdate.GetDateTime(readdate.GetOrdinal("datedepart"));
                    datee=datyy.ToString();  
                    int vid = readdate.GetInt32(readdate.GetOrdinal("volid"));
                    idv = vid;
                    int idd = readdate.GetInt32(readdate.GetOrdinal("passagerid"));
                    i=idd;
                }
                Console.WriteLine(datee);
                Console.WriteLine(idv);
                Console.WriteLine(i);
                if (tar == 0)
                {
                    return Ok("Aucune place disponible avec ce tarif");
                }else if(Cap == 0){
                    return Ok("Aucune place disponible dans ce vol");
                }else if (datee !="" && idv == reservation.VolId && i==reservation.PassagerId){
                    return Ok("Vous avez déjà fait une réservation à la même date du vol");
                }else{
                    var calcul = tar - 1;
                    var calcul2 = Cap -1;
                    string reserverVol = "INSERT INTO reservation(volid, passagerid, tarificationid, libelle, datereservation)" +
                "VALUES(@VolId, @PassagerId, @TarificationId, @Libelle, @DateReservation)";
                using var con = new NpgsqlConnection(dbc.Database.GetConnectionString());
                con.Open();
                using var commandsql = new NpgsqlCommand(reserverVol, con);

                    commandsql.Parameters.AddWithValue("VolId", reservation.VolId);
                    commandsql.Parameters.AddWithValue("PassagerId", reservation.PassagerId);
                    commandsql.Parameters.AddWithValue("TarificationId", reservation.TarificationId);
                    commandsql.Parameters.AddWithValue("Libelle", reservation.Libelle);
                    commandsql.Parameters.AddWithValue("DateReservation", reservation.DateReservation);

                    await commandsql.ExecuteNonQueryAsync();

                    string update = "UPDATE tarification SET nombreplacedispotarif='"+calcul+"' WHERE id='"+reservation.TarificationId+"'";
                    using var cmdUpdate = new NpgsqlCommand(update, con);
                    await cmdUpdate.ExecuteNonQueryAsync();

                    string modifVol = "UPDATE vol SET capacitemax='"+calcul2+"' WHERE id ='"+reservation.VolId+"'";
                    using var cmdUpdateVol = new NpgsqlCommand(modifVol, con);
                    await cmdUpdateVol.ExecuteNonQueryAsync();

                    return Ok("Votre réservation est effectuée");
                }

            }
            catch (Npgsql.NpgsqlException erreur)
            {

                return Ok("Erreur : " + erreur.Message);
            }
        }
        public class ReservationData
        {
            public List<Passager> Passagers { get; set; } = null!;
            public List<Reservation> Reservations { get; set; } = null!;
            public List<Vol> Vols { get; set; } = null!;
            public List<Tarif> Tarifs { get; set; } = null!;
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
                    " vol.id=reservation.volid AND tarification.id=reservation.tarificationid AND vol.numerovol like '%" + NumeroVol + "%'";

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
                return Ok("Attention, vous avez rencontré un problème avec la suppression!");
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("Erreur : " + e.Message);
            }
        }
    }
}