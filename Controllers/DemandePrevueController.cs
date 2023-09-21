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
    public class DemandePrevueController : ControllerBase
    {
        private AppDbContext dbc = new AppDbContext();
        [HttpGet]
        public async Task<IActionResult> Affichage(){
           if (!ModelState.IsValid)
           {
                return BadRequest(ModelState);
           }

           try{
             
                string selectDemande = "select * from prevision";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(selectDemande, connexion);

                var reader = await commandsql.ExecuteReaderAsync();
                var ListDemande = new List<Demande>();
                while (await reader.ReadAsync())
              
                {
                    int id = reader.GetInt32(reader.GetOrdinal("id"));
                    int idpassager = reader.GetInt32(reader.GetOrdinal("passagerid"));
                    string demandeprevue = reader.GetString(reader.GetOrdinal("demandeprevue"));
                    DateTime dateprevue = reader.GetDateTime(reader.GetOrdinal("dateprevue"));
                    string commentaire = reader.GetString(reader.GetOrdinal("commentaire"));

                    var demandes = new Demande{
                        IdPrevision = id,
                        IdPassager = idpassager,
                        DemandePrevue = demandeprevue,
                        DatePrevue = dateprevue,
                        Commentaire = commentaire
                    };
                    ListDemande.Add(demandes);
                    continue;
                }
                return Ok(ListDemande);
           } catch(Npgsql.NpgsqlException erreur){
                return Ok("erreur : " +erreur.Message);
           }
        }
        [Route("demande-prevue")]
        [HttpPost]
        public async Task<IActionResult> Demande([FromBody] Demande demande){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try{

                string demandePrevue = "insert into prevision(passagerid, demandeprevue, dateprevue, commentaire)"+
                " values(@PassagerId, @DemandePrevue, @DatePrevue, @Commentaire);";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(demandePrevue, connexion);

                commandsql.Parameters.AddWithValue("PassagerId", demande.IdPassager);
                commandsql.Parameters.AddWithValue("DemandePrevue", demande.DemandePrevue);
                commandsql.Parameters.AddWithValue("Dateprevue", demande.DatePrevue);
                commandsql.Parameters.AddWithValue("Commentaire", demande.Commentaire);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("ajout avec succès!");
            } catch(Npgsql.NpgsqlException erreur){
                
                if (erreur.SqlState == "23503")
                {
                    return BadRequest("Erreur inconnue");
                }
                else
                {
                    return BadRequest("Une erreur s'est produite lors de la requête : " + erreur.Message);
                }
            }
        }
        [Route("supprimer-demande")]
        [HttpDelete]
        public async Task<IActionResult> Suppression(int IdPassager){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try{

                string deleteByidPassager = "delete from prevision where id ='"+IdPassager+"'";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());

                connexion.Open();
                using var commandsql = new NpgsqlCommand(deleteByidPassager, connexion);
                await commandsql.ExecuteNonQueryAsync();

                return Ok("une demande est supprimée.");
            } catch(Npgsql.NpgsqlException erreur){

                return BadRequest("Erreur : " + erreur.Message);
            }
        }
    }
}