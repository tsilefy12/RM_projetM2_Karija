using apiWebCore.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using PostgreSQLAPI.Models;

namespace apiWebCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarifController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetTarif()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string selectTarif = "select * from tarification";
            using var dbC = new AppDbContext();
            using var connexDb = new NpgsqlConnection(dbC.Database.GetConnectionString());
            connexDb.Open();
            using var command = new NpgsqlCommand(selectTarif, connexDb);
            using var reader = await command.ExecuteReaderAsync();
           var ListTousTarifs = new List<Tarif>();
            while (await reader.ReadAsync())
            {
                int id = reader.GetInt32(reader.GetOrdinal("id"));
                string description = reader.GetString(reader.GetOrdinal("description"));
                double prix = reader.GetDouble(reader.GetOrdinal("prix"));
                string typetarif = reader.GetString(reader.GetOrdinal("type"));
                int nombreplacedispotarif = reader.GetInt32(reader.GetOrdinal("nombreplacedispotarif"));
                string statut = reader.GetString(reader.GetOrdinal("statut"));
                var tarifs = new Tarif
                {
                    Id = id,
                    Description = description,
                    Prix = prix,
                    TypeTarif = typetarif,
                    NombrePlaceDispoTarif = nombreplacedispotarif,
                    Statut = statut,
                };
                ListTousTarifs.Add(tarifs);
                continue;
            }
            return Ok(ListTousTarifs);
        }
        [Route("ajout-tarif")]
        [HttpPost]
        public async Task<IActionResult> Ajout([FromBody] Tarif tarif)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string ajoutTarif = "insert into tarification(description, prix, type, nombreplacedispotarif, statut)" +
            "values(@Description, @Prix, @Type, @NombrePlaceDispoTarif, @Statut)";

            using var dbC = new AppDbContext();
            using var connexion = new NpgsqlConnection(dbC.Database.GetConnectionString());
            try
            {
                connexion.Open();
                using var command = new NpgsqlCommand(ajoutTarif, connexion);

                command.Parameters.AddWithValue("Description", tarif.Description);
                command.Parameters.AddWithValue("Prix", tarif.Prix);
                command.Parameters.AddWithValue("Type", tarif.TypeTarif);
                command.Parameters.AddWithValue("NombrePlaceDispoTarif", tarif.NombrePlaceDispoTarif);
                command.Parameters.AddWithValue("Statut", tarif.Statut);

                var test = await command.ExecuteNonQueryAsync();

                return Ok("Ajout avec succès");
            }
            catch (Npgsql.PostgresException ex)
            {
                return BadRequest("Une erreur s'est produite lors de la requête : " + ex.Message);
            }
        }
        [Route("edit-tarif")]
        [HttpPost]
        public async Task<IActionResult> Edit(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                string edit = "select * from tarification where id =@Id";
                using var dbc = new AppDbContext();
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var command = new NpgsqlCommand(edit, connexion);
                command.Parameters.AddWithValue("Id", Id);

                var reader = await command.ExecuteReaderAsync();

                var ListEdit = new List<Tarif>();
                while (await reader.ReadAsync())
                {
                    int id = reader.GetInt32(reader.GetOrdinal("id"));
                    string description = reader.GetString(reader.GetOrdinal("description"));
                    double prix = reader.GetDouble(reader.GetOrdinal("prix"));
                    string typetarif = reader.GetString(reader.GetOrdinal("type"));
                    int nombreplacedispotarif = reader.GetInt32(reader.GetOrdinal("nombreplacedispotarif"));
                     string statut = reader.GetString(reader.GetOrdinal("statut"));
                    var tarifsEdit = new Tarif
                    {
                        Id = id,
                        Description = description,
                        Prix = prix,
                        TypeTarif = typetarif,
                        NombrePlaceDispoTarif = nombreplacedispotarif,
                        Statut = statut,
                    };
                    ListEdit.Add(tarifsEdit);
                }
                return Ok(ListEdit);
            }
        }
        [Route("modification-tarif")]
        [HttpPost]
        public async Task<IActionResult> Modification([FromBody] Tarif tarif, int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {

                try
                {
                    string modificationTarif = "update tarification set prix=@Prix, nombreplacedispotarif=@NombrePlaceDispoTarif, statut=@Statut, description=@Description"+
                    " where id =@Id";
                    using var dbc = new AppDbContext();
                    using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                    connexiondb.Open();
                    using var commandsql = new NpgsqlCommand(modificationTarif, connexiondb);

                    commandsql.Parameters.AddWithValue("Id", Id); ;
                    commandsql.Parameters.AddWithValue("Prix", tarif.Prix);
                    commandsql.Parameters.AddWithValue("NombrePlaceDispoTarif", tarif.NombrePlaceDispoTarif);
                    commandsql.Parameters.AddWithValue("Statut", tarif.Statut);
                    commandsql.Parameters.AddWithValue("Description", tarif.Description);

                    await commandsql.ExecuteNonQueryAsync();
                    return Ok("Modification succès");
                } catch(Npgsql.NpgsqlException e){
                    return Ok("Une erreur apparait : " + e.Message);
                }

            }
        }
        [Route("supprimer-tarif/{Id}")]
        [HttpDelete]
        public async Task<IActionResult> SupprimerTarif(int Id){

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else{
                try{

                    string supprimerTarif = "delete from tarification where id ="+Id;
                    using var dbc = new AppDbContext();
                    using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                    connexiondb.Open();
                    using var commandsql = new NpgsqlCommand(supprimerTarif, connexiondb);
                    await commandsql.ExecuteNonQueryAsync();

                    return Ok("Vous avez supprimé un tarif.");
                } catch(Npgsql.NpgsqlException e){
                    return Ok("une erreu apparait " + e.Message);
                }
            }
        }
        [Route("recherche-tarif")]
        [HttpPost]
        public async Task<IActionResult> Recherche(string search)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                var text = search.ToLower();
                string edit = "select * from tarification where description like '%"+text+"%' or statut like '%"+text+"%' or type like '%"+text+"%'";
                using var dbc = new AppDbContext();
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var command = new NpgsqlCommand(edit, connexion);
                var reader = await command.ExecuteReaderAsync();

                var ListEdit = new List<Tarif>();
                while (await reader.ReadAsync())
                {
                    int id = reader.GetInt32(reader.GetOrdinal("id"));
                    string description = reader.GetString(reader.GetOrdinal("description"));
                    double prix = reader.GetDouble(reader.GetOrdinal("prix"));
                    string typetarif = reader.GetString(reader.GetOrdinal("type"));
                    int nombreplacedispotarif = reader.GetInt32(reader.GetOrdinal("nombreplacedispotarif"));
                     string statut = reader.GetString(reader.GetOrdinal("statut"));
                    var tarifsEdit = new Tarif
                    {
                        Id = id,
                        Description = description,
                        Prix = prix,
                        TypeTarif = typetarif,
                        NombrePlaceDispoTarif = nombreplacedispotarif,
                        Statut = statut,
                    };
                    ListEdit.Add(tarifsEdit);
                }
                return Ok(ListEdit);
            }
        }
        [Route("select-tarif")]
        [HttpGet]
        public async Task<IActionResult> SelectTarif(int IdT)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string selectTarif = "select type, prix from tarification where id ="+IdT;
            using var dbC = new AppDbContext();
            using var connexDb = new NpgsqlConnection(dbC.Database.GetConnectionString());
            connexDb.Open();
            using var command = new NpgsqlCommand(selectTarif, connexDb);
            using var reader = await command.ExecuteReaderAsync();
           var ListTousTarifs = new List<Tarif>();
            while (await reader.ReadAsync())
            {
                double prix = reader.GetDouble(reader.GetOrdinal("prix"));
                string typetarif = reader.GetString(reader.GetOrdinal("type"));
                var tarifs = new Tarif
                {
                    Prix = prix,
                    TypeTarif = typetarif,
                };
                ListTousTarifs.Add(tarifs);
                continue;
            }
            return Ok(ListTousTarifs);
        }
        [Route("select-id")]
        [HttpGet]
        public async Task<IActionResult> SelectId()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string selectTarif = "select id from tarification";
            using var dbC = new AppDbContext();
            using var connexDb = new NpgsqlConnection(dbC.Database.GetConnectionString());
            connexDb.Open();
            using var command = new NpgsqlCommand(selectTarif, connexDb);
            using var reader = await command.ExecuteReaderAsync();
           var ListTousTarifs = new List<Tarif>();
            while (await reader.ReadAsync())
            {
                int id = reader.GetInt32(reader.GetOrdinal("id"));
                var tarifs = new Tarif
                {
                    Id = id,
                };
                ListTousTarifs.Add(tarifs);
                continue;
            }
            return Ok(ListTousTarifs);
        }
    }
}
