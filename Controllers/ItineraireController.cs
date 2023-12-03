using System;
using System.Collections.Generic;
using System.Data.Common;
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
    public class ItineraireController : ControllerBase
    {
        private readonly AppDbContext dbc = new();
        [HttpGet]
        public async Task<IActionResult> GetItineraire()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string getItineraire = "SELECT * FROM itineraires";
                using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexiondb.Open();
                using var commandsql = new NpgsqlCommand(getItineraire, connexiondb);

                var Afficher = await commandsql.ExecuteReaderAsync();
                var liste = new List<Itineraire>();
                while (await Afficher.ReadAsync())
                {
                    var ItinerairesListe = new Itineraire
                    {
                        Id = Afficher.GetInt32(Afficher.GetOrdinal("id")),
                        LiueDepart = Afficher.GetString(Afficher.GetOrdinal("lieudepart")),
                        LieuArrivee = Afficher.GetString(Afficher.GetOrdinal("lieuarrivee")),
                        LieuSeparteur = Afficher.GetString(Afficher.GetOrdinal("lieuseparateur")),
                        Statut = Afficher.GetString(Afficher.GetOrdinal("statut"))
                    };

                    liste.Add(ItinerairesListe);
                    continue;
                }

                return Ok(liste);
                
            }
            catch (System.Exception)
            {
                
                throw;
            }
        }

        [Route("ajout-itineraires")]
        [HttpPost]

        public async Task<IActionResult> Ajout([FromBody] Itineraire itineraire)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string ajout = "INSERT INTO itineraires(lieudepart, lieuarrivee, lieuseparateur, statut)"+
                "VALUES(@LieuDepart, @LieuArrivee, @LieuSeparateur, @Statut)";
                using var connection = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connection.Open();
                using var commandsql = new NpgsqlCommand(ajout, connection);

                commandsql.Parameters.AddWithValue("LieuDepart", itineraire.LiueDepart);
                commandsql.Parameters.AddWithValue("LieuArrivee", itineraire.LieuArrivee);
                commandsql.Parameters.AddWithValue("LieuSeparateur", itineraire.LieuSeparteur);
                commandsql.Parameters.AddWithValue("Statut", itineraire.Statut);

                var insert = await commandsql.ExecuteNonQueryAsync();

                if (insert == 1)
                {
                    return Ok("L'enregistrement d'itinéraire est succès");
                }else{
                    return Ok("Il y a un problème d'enregistrement");
                }


            }catch(Npgsql.NpgsqlException e)
            {
                return Ok("Erreur :" +e.Message);
            }
        }   
        [Route("edit-itineraire/{Id}")]
        [HttpGet]
        public async Task<IActionResult> Edit(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string edit = "SELECT * FROM itineraires WHERE id ="+Id;
                using var connection = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connection.Open();
                using var commandsql = new NpgsqlCommand(edit, connection);

                var EditItineraire = await commandsql.ExecuteReaderAsync();
                var listeEdit = new List<Itineraire>();
                if (await EditItineraire.ReadAsync())
                {
                   var listeE = new Itineraire
                   {
                       Id = EditItineraire.GetInt32(EditItineraire.GetOrdinal("id")),
                        LiueDepart = EditItineraire.GetString(EditItineraire.GetOrdinal("lieudepart")),
                        LieuArrivee = EditItineraire.GetString(EditItineraire.GetOrdinal("lieuarrivee")),
                        LieuSeparteur = EditItineraire.GetString(EditItineraire.GetOrdinal("lieuseparateur")),
                        Statut = EditItineraire.GetString(EditItineraire.GetOrdinal("statut"))
                   };
                   listeEdit.Add(listeE);
                }
                return Ok(listeEdit);
            }
            catch (System.Exception)
            {
                
                throw;
            }
        } 
        [Route("modification-itineraire")]
        [HttpPost]
        public async Task<IActionResult> Modification([FromBody] Itineraire itineraire, int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string modifier = "UPDATE itineraires SET lieudepart=@Lieudepart, lieuarrivee=@LieuArrivee, "+
                "lieuseparateur=@LieuSeparateur, statut=@Statut WHERE id ="+Id;
                using var connexion = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexion.Open();
                using var commandsql = new NpgsqlCommand(modifier, connexion);

                commandsql.Parameters.AddWithValue("LieuDepart", itineraire.LiueDepart);
                commandsql.Parameters.AddWithValue("LieuArrivee", itineraire.LieuArrivee);
                commandsql.Parameters.AddWithValue("LieuSeparateur", itineraire.LieuSeparteur);
                commandsql.Parameters.AddWithValue("Statut", itineraire.Statut);

                var update = await commandsql.ExecuteNonQueryAsync();

                if (update == 1)
                {
                    return Ok("La modification d'itinéraires a reussi.");
                }else{
                    return Ok("Une erreur s'est produit lors d'execution de la requête.");
                }
            }
            catch (Npgsql.NpgsqlException e)
            {
                
                return Ok("erreur :" +e.Message);
            }
        }
        [Route("suppression-itineraire/{Id}")]
        [HttpDelete]
        public async Task<IActionResult> Suppression(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string supprimer = "DELETE FROM itineraires WHERE id ="+Id;
                using var connexiondb = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connexiondb.Open();
                using var commandsql = new NpgsqlCommand(supprimer, connexiondb);

                var deleted = await commandsql.ExecuteNonQueryAsync();

                if (deleted == 1)
                {
                    return Ok("La suppression d'itinéraire est effectuéé.");
                }else
                {
                    return Ok("Votre demande de suppression a échoueé.");
                }

            }
            catch (Npgsql.NpgsqlException e)
            {
                
                return Ok("erreur :"+e.Message);
            }
        }
        [Route("recherche-itineraire")]
        [HttpGet]
        public async Task<IActionResult> Recherche(string recherche)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var karoka = recherche.ToLower();
                string rechercher = "SELECT * FROM itineraires WHERE lieudepart ILIKE '%"+karoka+"%'"+
                " OR lieuarrivee ILIKE '%"+karoka+"%' OR lieuseparateur ILIKE '%"+karoka+"%' or statut ILIKE '%"+karoka+"%'";
                using var connection = new NpgsqlConnection(dbc.Database.GetConnectionString());
                connection.Open();
                using var commandsql = new NpgsqlCommand(rechercher, connection);

                var EditItineraire = await commandsql.ExecuteReaderAsync();
                var listeEdit = new List<Itineraire>();
                while (await EditItineraire.ReadAsync())
                {
                   var listeE = new Itineraire
                   {
                       Id = EditItineraire.GetInt32(EditItineraire.GetOrdinal("id")),
                        LiueDepart = EditItineraire.GetString(EditItineraire.GetOrdinal("lieudepart")),
                        LieuArrivee = EditItineraire.GetString(EditItineraire.GetOrdinal("lieuarrivee")),
                        LieuSeparteur = EditItineraire.GetString(EditItineraire.GetOrdinal("lieuseparateur")),
                        Statut = EditItineraire.GetString(EditItineraire.GetOrdinal("statut"))
                   };
                   listeEdit.Add(listeE);
                   continue;
                }
                return Ok(listeEdit);
            }
            catch (System.Exception)
            {
                
                throw;
            }
        }
    }
}