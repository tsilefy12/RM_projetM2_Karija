﻿using apiWebCore.Models;
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

                var vols = new Vol
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    AvionId = reader.GetInt32(reader.GetOrdinal("avionid")),
                    NumeroVol = reader.GetString(reader.GetOrdinal("numerovol")),
                    DateDepart = reader.GetDateTime(reader.GetOrdinal("datedepart")),
                    HeureDepart = reader.GetTimeSpan(reader.GetOrdinal("heuredepart")),
                    CapaciteMax = reader.GetInt32(reader.GetOrdinal("capacitemax")),
                    LieuDepart = reader.GetString(reader.GetOrdinal("lieudepart")),
                    LieuArrivee = reader.GetString(reader.GetOrdinal("lieuarrivee")),
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

            using var db = new AppDbContext();
            using var connexion = new NpgsqlConnection(db.Database.GetConnectionString());

            string verifierAvion = "SELECT numerovol FROM vol WHERE numerovol='" + vol.NumeroVol + "'";
            connexion.Open();
            using var cmdverify = new NpgsqlCommand(verifierAvion, connexion);
            var reader = await cmdverify.ExecuteScalarAsync() as string;


            string selectAvionInfo = "SELECT avionid, datedepart FROM vol WHERE avionid='" + vol.AvionId + "' AND datedepart='" + vol.DateDepart + "'";
            using var commandsql = new NpgsqlCommand(selectAvionInfo, connexion);

            var read = await commandsql.ExecuteReaderAsync();

            var idAvion = 0;
            var daty = (2023 - 10 - 11).ToString();
            if (await read.ReadAsync())
            {
                int id = read.GetInt32(read.GetOrdinal("avionid"));
                idAvion = id;
                DateTime datee = read.GetDateTime(read.GetOrdinal("datedepart"));
                daty = datee.ToString();
            }
            Console.WriteLine("numero vol " + reader);
            Console.WriteLine("numero avion " + idAvion);
            Console.WriteLine("la date " + daty);

            if (reader == vol.NumeroVol)
            {
                return Ok("Numéro vol déjà existé dans la base de données.");
            }
            else if (idAvion == vol.AvionId && daty == (vol.DateDepart).ToString())
            {
                return Ok("Attention : Cet avion a déjà un vol prévu pour la même date.");
            }
            else
            {
                string ajoutvol = "INSERT INTO vol(avionid, numerovol, datedepart,heuredepart, capacitemax, lieudepart, lieuarrivee)" +
                "VALUES(@AvionId, @NumeroVol, @DateDepart,@HeureDepart,@CapaciteMax, @LieuDepart, @LieuArrivee)";
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

                    return Ok("Votre enregistrement a reussi");
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
        }
        [Route("supprimer-vol")]
        [HttpDelete]
        public async Task<IActionResult> Supprimmer(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string selectId = "SELECT vol.id FROM vol, reservation WHERE vol.id=reservation.volid AND vol.id=" + id;
                using var dbC = new AppDbContext();
                using var connex = new NpgsqlConnection(dbC.Database.GetConnectionString());
                connex.Open();
                using var cmd = new NpgsqlCommand(selectId, connex);
                var readId = await cmd.ExecuteReaderAsync();
                var idv = 0;
                while (await readId.ReadAsync())
                {
                    int idV = readId.GetInt32(readId.GetOrdinal("id"));
                    idv = idV;
                }

                Console.WriteLine(idv);
                if (idv == 0)
                {
                    string supprimerVol = "DELETE FROM vol WHERE id=@Id";
                    using var connexionDb = new NpgsqlConnection(dbC.Database.GetConnectionString());
                    connexionDb.Open();
                    using var command = new NpgsqlCommand(supprimerVol, connexionDb);
                    command.Parameters.AddWithValue("Id", id);

                    await command.ExecuteNonQueryAsync();
                    return Ok("Vous avez supprimé un vol.");
                }else{
                    string supp = "DELETE FROM reservation WHERE volid="+idv;
                    string supprimerVol = "DELETE FROM vol WHERE id="+idv;
                    using var cnn = new NpgsqlConnection(dbC.Database.GetConnectionString());
                    cnn.Open();
                    using var cmdsql = new NpgsqlCommand(supp, cnn);
                    await cmdsql.ExecuteNonQueryAsync();
                    using var command = new NpgsqlCommand(supprimerVol, cnn);
                    await command.ExecuteNonQueryAsync();
                    
                    return Ok("Vous avez supprimé un vol déjà réservé");
                }

            }
            catch (Npgsql.NpgsqlException e)
            {

                return BadRequest("erreur :" + e.Message);
            }
        }
        [Route("recherche")]
        [HttpGet]
        public async Task<IActionResult> RechercheVol(string recherche)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var lieu1 = recherche.ToLower();
                string rechercheVol = "SELECT * FROM vol WHERE lieudepart ILIKE  @LieuDepart OR lieuarrivee ILIKE  @LieuArrivee OR numerovol ='" + recherche + "'";
                using var dbC = new AppDbContext();
                using var connexiondb = new NpgsqlConnection(dbC.Database.GetConnectionString());
                connexiondb.Open();
                using var command = new NpgsqlCommand(rechercheVol, connexiondb);
                command.Parameters.AddWithValue("LieuDepart", "%" + recherche + "%");
                command.Parameters.AddWithValue("LieuArrivee", "%" + recherche + "%");

                using var reader = await command.ExecuteReaderAsync();
                List<Vol> ListRechercheVol = new List<Vol>();
                while (await reader.ReadAsync())
                {
                    var volsResulat = new Vol
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("id")),
                        AvionId = reader.GetInt32(reader.GetOrdinal("avionid")),
                        NumeroVol = reader.GetString(reader.GetOrdinal("numerovol")),
                        DateDepart = reader.GetDateTime(reader.GetOrdinal("datedepart")),
                        HeureDepart = reader.GetTimeSpan(reader.GetOrdinal("heuredepart")),
                        CapaciteMax = reader.GetInt32(reader.GetOrdinal("capacitemax")),
                        LieuDepart = reader.GetString(reader.GetOrdinal("lieudepart")),
                        LieuArrivee = reader.GetString(reader.GetOrdinal("lieuarrivee")),

                    };
                    ListRechercheVol.Add(volsResulat);
                    continue;
                }
                return Ok(ListRechercheVol);
            }
            catch (System.Exception)
            {

                throw;
            }
        }
        [Route("recherche-vol")]
        [HttpGet]
        public async Task<IActionResult> Search(string search)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var lieu = search.ToLower();
                string rechercheVol = "SELECT * FROM vol WHERE lieudepart LIKE '%" + lieu + "%' OR lieuarrivee LIKE '%" + lieu + "%' OR numeroVol LIKE '%" + lieu + "%'";
                using var dbC = new AppDbContext();
                using var connexiondb = new NpgsqlConnection(dbC.Database.GetConnectionString());
                connexiondb.Open();
                using var command = new NpgsqlCommand(rechercheVol, connexiondb);

                using var reader = await command.ExecuteReaderAsync();
                List<Vol> ListRechercheVol = new List<Vol>();
                while (await reader.ReadAsync())
                {

                    var volsResulat = new Vol
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("id")),
                        AvionId = reader.GetInt32(reader.GetOrdinal("avionid")),
                        NumeroVol = reader.GetString(reader.GetOrdinal("numerovol")),
                        DateDepart = reader.GetDateTime(reader.GetOrdinal("datedepart")),
                        HeureDepart = reader.GetTimeSpan(reader.GetOrdinal("heuredepart")),
                        CapaciteMax = reader.GetInt32(reader.GetOrdinal("capacitemax")),
                        LieuDepart = reader.GetString(reader.GetOrdinal("lieudepart")),
                        LieuArrivee = reader.GetString(reader.GetOrdinal("lieuarrivee")),

                    };
                    ListRechercheVol.Add(volsResulat);
                    continue;
                }
                return Ok(ListRechercheVol);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return Ok("erreur :" + e.Message);
            }
        }
        [Route("edit-vol/{Id}")]
        [HttpGet]
        public async Task<IActionResult> EditVol(string Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string edit = "SELECT * FROM vol WHERE numerovol=@Id";
                using var dbC = new AppDbContext();
                using var connexiondb = new NpgsqlConnection(dbC.Database.GetConnectionString());
                connexiondb.Open();
                using var command = new NpgsqlCommand(edit, connexiondb);
                command.Parameters.AddWithValue("Id", Id);

                using var reader = await command.ExecuteReaderAsync();
                List<Vol> ListEditVol = new List<Vol>();
                if (await reader.ReadAsync())
                {

                    var volsResulat = new Vol
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("id")),
                        AvionId = reader.GetInt32(reader.GetOrdinal("avionid")),
                        NumeroVol = reader.GetString(reader.GetOrdinal("numerovol")),
                        DateDepart = reader.GetDateTime(reader.GetOrdinal("datedepart")),
                        HeureDepart = reader.GetTimeSpan(reader.GetOrdinal("heuredepart")),
                        CapaciteMax = reader.GetInt32(reader.GetOrdinal("capacitemax")),
                        LieuDepart = reader.GetString(reader.GetOrdinal("lieudepart")),
                        LieuArrivee = reader.GetString(reader.GetOrdinal("lieuarrivee")),

                    };
                    ListEditVol.Add(volsResulat);
                }
                return Ok(ListEditVol);
            }
            catch (Npgsql.NpgsqlException e)
            {

                return BadRequest("erreur :" + e.Message);
            }
        }
        [Route("modification-vol/{Id}")]
        [HttpPost]
        public async Task<IActionResult> ModificationVol([FromBody] Vol vol, string Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                try
                {
                    string modification = "UPDATE vol SET datedepart=@DateDepart, heuredepart=@HeureDepart, lieudepart=@LieuDepart, lieuarrivee=@LieuArrivee, capacitemax=@Capacite WHERE numerovol = @Id";
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
                        command.Parameters.AddWithValue("Capacite", vol.CapaciteMax);

                        await command.ExecuteNonQueryAsync();
                    }
                    return Ok("Modification est succès.");
                }
                catch (Npgsql.NpgsqlException e)
                {
                    return Ok("Une erreur apparait : " + e.Message);
                }
            }

        }
    }
}