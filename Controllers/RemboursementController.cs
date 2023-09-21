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
    public class RemboursementController : ControllerBase
    {
        private AppDbContext dbc = new AppDbContext();
        [HttpGet]
        public async Task<IActionResult> Get(){
            if(!ModelState.IsValid){

                return BadRequest(ModelState);

            }
            try{

                string select = "SELECT * FROM remboursement";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(select, connexion);

                var reader = await commandsql.ExecuteReaderAsync();

                var ListRemboursement = new List<Remboursement>();

                while (await reader.ReadAsync()){

                    string id = reader.GetString(reader.GetOrdinal("mailadresse"));
                    string name = reader.GetString(reader.GetOrdinal("nompass"));
                    string moderemboursement = reader.GetString(reader.GetOrdinal("moderemboursement"));
                    string piece = reader.GetString(reader.GetOrdinal("piecejustificative"));
                    long telephoneremboursement = reader.GetInt64(reader.GetOrdinal("telephoneremboursement"));
                    DateTime datedemanderemboursement = reader.GetDateTime(reader.GetOrdinal("datedemanderemboursement"));
                    string verification = reader.GetString(reader.GetOrdinal("verification"));

                    var remboursements = new Remboursement{
                        MailAdresse = id,
                        NomPass = name,
                        ModeRemboursement = moderemboursement,
                        PieceJustificative = piece,
                        TelephoneRemboursement= telephoneremboursement,
                        DateDemandeRemboursement = datedemanderemboursement,
                        Verification = verification,
                    };
                    ListRemboursement.Add(remboursements);
                    continue;
                }
                return Ok(ListRemboursement);
            }catch(Npgsql.NpgsqlException e)
            {
                return Ok("Erreur : " +e.Message);
            }
        }
        [Route("demande-remboursement")]
        [HttpPost]
        public async Task<IActionResult> DemandeRemboursement([FromBody] Remboursement remboursement){
            if(!ModelState.IsValid){

                return BadRequest(ModelState);
            }

            try{

                string demandeRemboursement = "INSERT INTO remboursement(nompass, moderemboursement, piecejustificative, telephoneremboursement, datedemanderemboursement, mailadresse, verification)"+
                "VALUES(@NomPass, @ModeRemboursement, @PieceJustificative, @TelephoneRemboursement, @DateDemandeRemboursement, @MailAdresse, 'Non Remboursé')";
                using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexiondb.Open();
                using var commandsql = new NpgsqlCommand(demandeRemboursement, connexiondb);

                commandsql.Parameters.AddWithValue("NomPass", remboursement.NomPass);
                commandsql.Parameters.AddWithValue("ModeRemboursement", remboursement.ModeRemboursement);
                commandsql.Parameters.AddWithValue("PieceJustificative", remboursement.PieceJustificative);
                commandsql.Parameters.AddWithValue("TelephoneRemboursement", remboursement.TelephoneRemboursement);
                commandsql.Parameters.AddWithValue("DateDemandeRemboursement", remboursement.DateDemandeRemboursement);
                commandsql.Parameters.AddWithValue("MailAdresse", remboursement.MailAdresse);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("Votre demande de remboursement a été envoyée.");
            } catch(Npgsql.NpgsqlException e){

                return Ok("Erreur : " +e.Message);
            }
        }
        [Route("recherche-remboursement")]
        [HttpGet]
         public async Task<IActionResult> RechercheRemboursement(string mailadresse){
            if(!ModelState.IsValid){

                return BadRequest(ModelState);

            }
            try{

                string select = "SELECT * FROM remboursement WHERE mailadresse ='"+mailadresse+"'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(select, connexion);

                var reader = await commandsql.ExecuteReaderAsync();

                var ListRechercheRemboursement = new List<Remboursement>();

                if (await reader.ReadAsync()){

                    string id = reader.GetString(reader.GetOrdinal("mailadresse"));
                    string name = reader.GetString(reader.GetOrdinal("nompass"));
                    string moderemboursement = reader.GetString(reader.GetOrdinal("moderemboursement"));
                    string piece = reader.GetString(reader.GetOrdinal("piecejustificative"));
                    long telephoneremboursement = reader.GetInt64(reader.GetOrdinal("telephoneremboursement"));
                    DateTime datedemanderemboursement = reader.GetDateTime(reader.GetOrdinal("datedemanderemboursement"));
                    string verification = reader.GetString(reader.GetOrdinal("verification"));

                    var remboursements = new Remboursement{
                        MailAdresse = id,
                        NomPass = name,
                        ModeRemboursement = moderemboursement,
                        PieceJustificative = piece,
                        TelephoneRemboursement= telephoneremboursement,
                        DateDemandeRemboursement = datedemanderemboursement,
                        Verification = verification,
                    };
                    ListRechercheRemboursement.Add(remboursements);
                    return Ok(ListRechercheRemboursement);
                }
                return Ok("Vous n'avez pas encore effectué la demande de remboursement.");
               
            }catch(Npgsql.NpgsqlException e)
            {
                return Ok("Erreur : " +e.Message);
            }
        }
        [Route("suppression-remboursement")]
        [HttpDelete]
        public async Task<IActionResult> SupprimerRemboursement(string mail){
            if(!ModelState.IsValid){

                return BadRequest(ModelState);
            }

            try{

                string delete = "DELETE FROM remboursement WHERE mailadresse='"+mail+"'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(delete, connexion);

                await commandsql.ExecuteNonQueryAsync();

                return Ok("La demande de remboursement pour la personne ayant l'adresse email '"+mail+"' est supprimée.");
            } catch(Npgsql.NpgsqlException e){

                return Ok("Erreur : "+e.Message);
            }
        }
    }
}
       