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
                string daty = "SELECT datereservation, passagerid, volid FROM reservation WHERE passagerid = '"+reservation.PassagerId+"'";
                using var condate = new NpgsqlConnection(dbc.Database.GetConnectionString());
                condate.Open();
                using var cmddate = new NpgsqlCommand(daty, condate);
                var readdate = await cmddate.ExecuteReaderAsync();
                var datee ="";
                var idv = 0;
                var i=0;
                var dt = reservation.DateReservation.ToString();
                while (await readdate.ReadAsync())
                {
                    DateTime datyy = readdate.GetDateTime(readdate.GetOrdinal("datereservation"));
                    datee=datyy.ToString();  
                    int vid = readdate.GetInt32(readdate.GetOrdinal("volid"));
                    idv = vid;
                    int idd = readdate.GetInt32(readdate.GetOrdinal("passagerid"));
                    i=idd;

                    Console.WriteLine("daty alaina :" +datee);
                    Console.WriteLine("daty ampidirina :" +dt);
                    if (datee == dt  && idv == reservation.VolId && i==reservation.PassagerId){
                        return Ok("Vous avez déjà fait une réservation à la même date du vol");
                    }

                    continue;
                }
               
                Console.WriteLine(idv);
                Console.WriteLine(i); 
                var nombre = reservation.NombrePlace;
                var calcul2 = Cap - nombre;
                if(Cap == 0){
                    return Ok("Aucune place disponible dans ce vol");
                } else if(calcul2 < 0){
                    return Ok("Nombre de place est insuffisante");
                }
                else{
                    string reserverVol = "INSERT INTO reservation(volid, passagerid, tarificationid, nombreplace, datereservation)" +
                "VALUES(@VolId, @PassagerId, @TarificationId, @NombrePlace, @DateReservation)";
                using var con = new NpgsqlConnection(dbc.Database.GetConnectionString());
                con.Open();
                using var commandsql = new NpgsqlCommand(reserverVol, con);

                    commandsql.Parameters.AddWithValue("VolId", reservation.VolId);
                    commandsql.Parameters.AddWithValue("PassagerId", reservation.PassagerId);
                    commandsql.Parameters.AddWithValue("TarificationId", reservation.TarificationId);
                    commandsql.Parameters.AddWithValue("NombrePlace", reservation.NombrePlace);
                    commandsql.Parameters.AddWithValue("DateReservation", reservation.DateReservation);

                    await commandsql.ExecuteNonQueryAsync();

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

                return Ok("La réservation du passager ayant le numéro '" + IdP + "' est supprimée.");
                
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("Erreur : " + e.Message);
            }
        }
    }
}