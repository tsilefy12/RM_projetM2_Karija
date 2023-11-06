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
                "VALUES(@NomPass, @ModeRemboursement, @PieceJustificative, @TelephoneRemboursement, @DateDemandeRemboursement, @MailAdresse, 'Non validé')";
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
        [Route("recherche-remboursement/{mailadresse}")]
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
        [Route("verifier-information/{adresseMail}")]
        [HttpGet]
        public async Task<IActionResult> VerifierInfo(string adresseMail){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string infon = "SELECT passager.email, passager.nompassager, passager.telephone, annulation.methodepaiement, annulation.valide"+
                " FROM passager, annulation WHERE passager.email=annulation.mailaka AND passager.email ='"+adresseMail+"'";

                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());

                connexion.Open();

                using var command = new NpgsqlCommand(infon, connexion);
                 var reader = await command.ExecuteReaderAsync();
                 var listeP = new List<Passager>();
                 var listeA = new List<Annulation>();

                 while (await reader.ReadAsync())
                 {
                    var p = new Passager{
                        Email = reader.GetString(reader.GetOrdinal("email")),
                        NomPassager = reader.GetString(reader.GetOrdinal("nompassager")),
                        Telephone = reader.GetInt32(reader.GetOrdinal("telephone")),
                    };
                    listeP.Add(p);

                    var a = new Annulation{
                        MethodePaiement = reader.GetString(reader.GetOrdinal("methodepaiement")),
                        Valide = reader.GetString(reader.GetOrdinal("valide")),
                    };
                    listeA.Add(a);
                 }
                 var listeToutes = listeP.Zip(listeA, (passager, annulation) => new {Passager = passager, Annulation = annulation}).ToList();
                foreach (var item in listeToutes)
                {
                    Passager passager = item.Passager;
                    Annulation annulation = item.Annulation;    
                }
                return Ok(listeToutes);
            }
            catch (System.Exception)
            {
                
                throw;
            }
        }
        [Route("edit-remboursement/{Mail}")]
        [HttpPost]
        public async Task<IActionResult> Edit(string Mail){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string edit = "SELECT verification FROM remboursement WHERE mailadresse ='"+Mail+"'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandEdit = new NpgsqlCommand(edit, connexion);

                var read = await commandEdit.ExecuteReaderAsync();
                var verify ="";
                if (await read.ReadAsync())
                {
                    verify = read.GetString(read.GetOrdinal("verification"));
                }
                return Ok(verify);
            }
            catch (Npgsql.NpgsqlException e)
            {
                
                return Ok("erreur :"+e.Message);
            }
        }
        [Route("modifier-validation/{Mail}")]
        [HttpPost]
        public async Task<IActionResult> Modifier([FromBody] Remboursement  remboursement, string Mail){
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string modif = "UPDATE remboursement SET verification =@Verification WHERE mailadresse='"+Mail+"'";
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();

                using var cmd = new NpgsqlCommand(modif, connexion);

                cmd.Parameters.AddWithValue("Verification", remboursement.Verification);

                await cmd.ExecuteNonQueryAsync();

                return Ok("La mise à jour de la vérification est effectuée");
            }
            catch (Npgsql.NpgsqlException e)
            {
                
                return Ok("Erreur :"+e.Message);
            }
        }
    }
}
       