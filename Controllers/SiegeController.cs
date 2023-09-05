using apiWebCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using PostgreSQLAPI.Models;

namespace apiWebCore.Controllers
{
    [Route("api/[controller]")]
    public class SiegeController : Controller
    {
        [HttpGet]
        public IEnumerable<Siege> Get()
        {
            using (var dbc = new AppDbContext())
            {
                var sieges = dbc.Sieges.OrderBy(p => p.IdSiege);
                return sieges.ToList();

            }
        }
        [Route("ajout-siege")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Siege siege)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            string ajout = "INSERT INTO siege(numerosiege, classetarif, statut) VALUES (@NumeroSiege, @ClasseTarif, @Statut)";
            using (var dbC = new AppDbContext())
            {
                using(var connexion = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexion.Open();
                    using (var cmd = new NpgsqlCommand(ajout, connexion))
                    {
                        cmd.Parameters.AddWithValue("NumeroSiege", siege.NumeroSiege);
                        cmd.Parameters.AddWithValue("ClasseTarif", siege.ClasseTarif);
                        cmd.Parameters.AddWithValue("Statut", siege.Statut);

                        await cmd.ExecuteNonQueryAsync();
                        
                    }
                }
            }
            return Ok("ajout du siège succès!!");
        }

        //fonction recherche un siège
        [Route("recherche/{Numero}")]
        [HttpGet]
        public async Task<IActionResult> Recherche(string Numero)
        {
            string select = "SELECT * FROM siege WHERE numerosiege LIKE @Numero";
            using (var dbC = new AppDbContext())
            {
                using(var connexion = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexion.Open();
                    using(var command = new NpgsqlCommand(select, connexion))
                    {
                        command.Parameters.AddWithValue("Numero", "%"+Numero+"%");

                        using(var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                int id=reader.GetInt32(reader.GetOrdinal("id"));
                                string numerosiege=reader.GetString(reader.GetOrdinal("numerosiege"));
                                string classetarif=reader.GetString(reader.GetOrdinal("classetarif"));
                                string statut=reader.GetString(reader.GetOrdinal("statut"));

                               var sieges = new Siege
                               {
                                  IdSiege = id,
                                  NumeroSiege = numerosiege,
                                  ClasseTarif = classetarif,
                                  Statut = statut,
                               };
                                 return Ok(sieges);
                            }
                            return Ok("Siege n'existe pas");
                        }
                    }
                }
            }
        }

        //fonction editer un siège
        [Route("editer/{Num}")]
        [HttpGet]
        public async Task<IActionResult> EditSiege(string Num)
        {
            string edit = "SELECT * FROM siege WHERE numerosiege=@Num";
            using(var dbC = new AppDbContext())
            {
                using(var connexion = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexion.Open();
                    using var command = new NpgsqlCommand(edit, connexion);
                    command.Parameters.AddWithValue("Num", Num);
                    using (var readerEdit = await command.ExecuteReaderAsync())
                        if (await readerEdit.ReadAsync())
                        {
                            int id = readerEdit.GetInt32(readerEdit.GetOrdinal("id"));
                            string numerosiege = readerEdit.GetString(readerEdit.GetOrdinal("numerosiege"));
                            string classetarif = readerEdit.GetString(readerEdit.GetOrdinal("classetarif"));
                            string statut = readerEdit.GetString(readerEdit.GetOrdinal("statut"));

                            var sieges = new Siege
                            {
                                IdSiege = id,
                                NumeroSiege = numerosiege,
                                ClasseTarif = classetarif,
                                Statut = statut,
                            };
                            return Ok(sieges);
                        }
                    return Ok("siege n'existe pas");
                }
            }
        }

        //fonction pour la modification siège
        [Route("modification/{Numero}")]
        [HttpPost]
        public async Task<IActionResult> Modification([FromBody] Siege sieges , string Numero)
        {
            string modifier = "UPDATE siege SET classetarif=@ClasseTarif, statut=@Statut WHERE numerosiege=@Numero";
            using(var dbC = new AppDbContext())
            {
                using(var connexion = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexion.Open();
                    using(var command = new NpgsqlCommand(modifier, connexion))
                    {
                        command.Parameters.AddWithValue("Numero", Numero);
                        command.Parameters.AddWithValue("ClasseTarif", sieges.ClasseTarif);
                        command.Parameters.AddWithValue("Statut", sieges.Statut);

                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            return Ok("La modifcation est succès!!");
        }

        //fonction supprimer un siège
        [Route("supprimer-siege/{Id}")]
        [HttpDelete]
        public async Task<IActionResult> Delete(int Id)
        {
             if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string supprimer = "DELETE FROM siege WHERE id=@Id";
            using(var dbC = new AppDbContext())
            {
                using(var connexion = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexion.Open();
                    using(var command = new NpgsqlCommand(supprimer, connexion))
                {
                    command.Parameters.AddWithValue("Id", Id);
                    await command.ExecuteNonQueryAsync();
                }
                }
            }
            return Ok("Un siège est supprimé");
        }
    }
}
