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
    public class CompagnieController : Controller
    {
        [HttpGet]
        public async Task<IActionResult> Afficher()
        {
            string select = "SELECT * FROM compagnieaerienne";
            List<CompaginAerienne> compagniesList = new List<CompaginAerienne>();
            using (var dbC = new AppDbContext())
            {
                using(var connexionDb = new NpgsqlConnection(dbC.Database.GetConnectionString()))
                {
                    connexionDb.Open();
                    using(var command = new NpgsqlCommand(select, connexionDb))
                    {
                        using (var readerCompagnie = await command.ExecuteReaderAsync())
                        {
                            var compagnies = new CompaginAerienne();
                            while (await readerCompagnie.ReadAsync())
                            {
                                int id = readerCompagnie.GetInt32(readerCompagnie.GetOrdinal("id"));
                                string nomcompagnie = readerCompagnie.GetString(readerCompagnie.GetOrdinal("nomcompagnie"));
                                string codecompagnie = readerCompagnie.GetString(readerCompagnie.GetOrdinal("codecompagnie"));
                                string adresscompagnie = readerCompagnie.GetString(readerCompagnie.GetOrdinal("adressecompagnie"));
                                int contact = readerCompagnie.GetInt32(readerCompagnie.GetOrdinal("contact"));
                                string emailcompagnie = readerCompagnie.GetString(readerCompagnie.GetOrdinal("emailcompagnie"));

                                compagnies = new CompaginAerienne
                                {
                                    Id = id,
                                    NomCompagnie = nomcompagnie,
                                    CodeCompagnie = codecompagnie,
                                    AdresseCompagnie = adresscompagnie,
                                    Contact = contact,
                                    EmailCompagnie = emailcompagnie
                                };
                                compagniesList.Add(compagnies);
                                continue;
                                
                            }
                                return Ok(compagniesList);
                        }
                    }
                }
            }
        }
    }
}
