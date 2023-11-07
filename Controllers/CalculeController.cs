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
    public class CalculeController : ControllerBase
    {

        private AppDbContext dbc = new AppDbContext();
        [HttpGet]
        public async Task<IActionResult> Revenu()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string calculRevenu = "SELECT sum(tarification.prix) As Tarif, vol.numerovol, vol.capacitemax, vol.datedepart, vol.heuredepart, " +
                    "count(reservation.passagerid) As NombrePassager FROM vol, tarification, reservation WHERE reservation.volid = vol.id " +
                    "AND tarification.id= reservation.tarificationid GROUP BY vol.id";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                await connexion.OpenAsync();

                using var cmd = new NpgsqlCommand(calculRevenu, connexion);
                var reader = await cmd.ExecuteReaderAsync();

                var results = new List<Revenue>();

                while (await reader.ReadAsync())
                {
                    var liste = new Revenue
                    {
                        Tarif = reader.GetFieldValue<double>(reader.GetOrdinal("Tarif")),
                        numerovol = reader.GetFieldValue<string>(reader.GetOrdinal("numerovol")),
                        capacitemax = reader.GetFieldValue<int>(reader.GetOrdinal("capacitemax")),
                        datedepart = reader.GetFieldValue<DateTime>(reader.GetOrdinal("datedepart")),
                        heuredepart = reader.GetFieldValue<TimeSpan>(reader.GetOrdinal("heuredepart")),
                        NombrePassager = reader.GetFieldValue<int>(reader.GetOrdinal("NombrePassager")),
                    };
                    results.Add(liste);
                }

                string jsonResult = System.Text.Json.JsonSerializer.Serialize(results);

                return Ok(jsonResult);
            }
            catch (Npgsql.NpgsqlException ex)
            {
                return Ok("Une erreur s'est produite : " + ex.Message);
            }
        }
        [Route("total-revenu")]
        [HttpGet]
        public async Task<IActionResult> Total()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string total = "SELECT sum(tarification.prix) As Tarif FROM tarification, reservation WHERE tarification.id=reservation.tarificationid";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var cmdsql = new NpgsqlCommand(total, connexion);
                var reader = await cmdsql.ExecuteReaderAsync();
                var TotalRevenue = new List<Revenue>();

                while (await reader.ReadAsync())
                {
                    var rev = new Revenue();

                    if (!reader.IsDBNull(reader.GetOrdinal("Tarif")))
                    {
                        rev.Tarif = reader.GetFieldValue<double>(reader.GetOrdinal("Tarif"));
                        TotalRevenue.Add(rev);
                    }
                    else
                    {
                        return Ok(0); // Si la colonne 'Tarif' est nulle, renvoyez 0 (vous pouvez choisir une autre valeur par défaut si nécessaire)
                    }
                }

                return Ok(TotalRevenue);

            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("erreur :" + e.Message);
            }
        }
        [Route("rechercher")]
        [HttpGet]
        public async Task<IActionResult> Rechercher(string numerovol)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var search = numerovol.ToLower();
                string calculRevenu = "SELECT sum(tarification.prix) As Tarif, vol.numerovol, vol.capacitemax, vol.datedepart, vol.heuredepart, " +
                    "count(reservation.passagerid) As NombrePassager FROM vol, tarification, reservation WHERE reservation.volid = vol.id " +
                    "AND tarification.id= reservation.tarificationid AND vol.numerovol ILIKE '%" + search + "%'GROUP BY vol.id";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                await connexion.OpenAsync();

                using var cmd = new NpgsqlCommand(calculRevenu, connexion);
                var reader = await cmd.ExecuteReaderAsync();

                var results = new List<Revenue>();

                while (await reader.ReadAsync())
                {
                    var liste = new Revenue
                    {
                        Tarif = reader.GetFieldValue<double>(reader.GetOrdinal("Tarif")),
                        numerovol = reader.GetFieldValue<string>(reader.GetOrdinal("numerovol")),
                        capacitemax = reader.GetFieldValue<int>(reader.GetOrdinal("capacitemax")),
                        datedepart = reader.GetFieldValue<DateTime>(reader.GetOrdinal("datedepart")),
                        heuredepart = reader.GetFieldValue<TimeSpan>(reader.GetOrdinal("heuredepart")),
                        NombrePassager = reader.GetFieldValue<int>(reader.GetOrdinal("NombrePassager")),
                    };
                    results.Add(liste);
                }

                string jsonResult = System.Text.Json.JsonSerializer.Serialize(results);

                return Ok(jsonResult);
            }
            catch (Npgsql.NpgsqlException ex)
            {
                return Ok("Une erreur s'est produite : " + ex.Message);
            }
        }
        [Route("Nombre-vol")]
        [HttpGet]
        public async Task<IActionResult> NombreTotal()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string nombreTotal = "SELECT count(reservation.volid) As NombrePassager FROM vol, reservation WHERE vol.id=reservation.volid GROUP BY vol.id";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var cmd = new NpgsqlCommand(nombreTotal, connexion);
                var read = await cmd.ExecuteReaderAsync();
                var nb = new List<Revenue>();
                if (await read.ReadAsync())
                {
                    var reve = new Revenue
                    {
                        NombrePassager = read.GetFieldValue<int>(read.GetOrdinal("NombrePassager")),
                    };
                    nb.Add(reve);
                }
                return Ok(nb);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("erreur :" + e.Message);
            }
        }
    }
}