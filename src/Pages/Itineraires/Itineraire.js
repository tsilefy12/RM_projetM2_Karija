import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import './Itineraire.css'
import { Box, Dialog, DialogActions, DialogContentText, DialogTitle, InputAdornment, Modal, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { Button, Form, FormLabel, Table } from 'react-bootstrap'
import * as AiIcons from "react-icons/ai"
import axios from 'axios'

function Itineraire() {
    const [donneItineraire, setDonneitineraire] = useState([]);
    const [messageItineraire, setMessageItineraire] = useState("");
    const [liueDepart, setLieuDepart] = useState("");
    const [lieuArrivee, setLieuArrivee] = useState("");
    const [lieuSeparteur, setLieuSepparateur] = useState("");
    const [statut, setStatut] = useState("");
    const [rechercherInput, setRechercheInput] = useState("");
    const [open, setOpen] = useState(false)
    const [editId, setEditId] = useState("");
    const [editLieudepart, setEditLieudepart] = useState("");
    const [editLieuarrivee, setEditLieuarrivee] = useState("");
    const [editLieuseparateur, setEditLieuseparateur] = useState("");
    const [editStatut, setEditStatut] = useState("");
    const [messageEdit, setMessageEdit] = useState("");
    const [editModif, setEditModif] = useState("");
    const [openDialog, setopenDialog] = useState(false);
    const [a, setA] = useState("");

    useEffect(() => {
        AfficherItineraire();
        VerificationRechercheItin();
    })
    const AfficherItineraire = async () => {
        try {
            await axios.get('http://localhost:5077/api/Itineraire').then(({ data }) => {
                setDonneitineraire(data);
            })

        } catch (error) {
            console.log("erreur : ", error);
        }
    }
    const ajouterItineraire = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("liueDepart", liueDepart)
        formData.append("lieuArrivee", lieuArrivee)
        formData.append("lieuSeparteur", lieuSeparteur)
        formData.append("statut", statut)

        if (liueDepart === "" || lieuArrivee === "" || statut === "Sélectionner") {
            setMessageItineraire(<label className='text-danger'>Veuillez remplir le champ</label>)
        } else if (statut === "Non direct" && lieuSeparteur === "") {
            setMessageItineraire(<label className='text-danger'>Le point intermédiaire est obligatoire: Lieu separateur</label>)
        }
        else {
            try {
                await axios.post('http://localhost:5077/api/Itineraire/ajout-itineraires', formData,
                    { headers: { 'Content-Type': 'application/json' } }).then(({ data }) => {
                        setMessageItineraire(<label className='text-success'>{data}</label>)
                        setTimeout(() => {
                            setMessageItineraire("");
                        }, 5000);
                    })
                setLieuDepart("");
                setLieuArrivee("");
                setLieuSepparateur("");
                setStatut("Sélectionner");
            } catch (error) {

            }
        }
    }
    const supprimerItineraire = async () => {
        await axios.delete(`http://localhost:5077/api/Itineraire/suppression-itineraire/${a}`).then(({ data }) => {
            console.log("message :", data);
            setMessageItineraire(<label className='text-danger'>{data}</label>)
            setTimeout(() => {
                setMessageItineraire("");
            }, 5000);
        })
        setopenDialog(false)
        AfficherItineraire();
        
    }
    const ConfirSupprimer = (b) =>{
        setopenDialog(true)
        setA(b)
    }

    const rechercherItineraire = async () => {
        try {
            await axios.get(`http://localhost:5077/api/Itineraire/recherche-itineraire?recherche=${rechercherInput}`).then(({ data }) => {
                setDonneitineraire(data);
            })
        } catch (error) {

        }
    }
    const VerificationRechercheItin = () => {
        if (rechercherInput === "") {
            AfficherItineraire();
        } else {
            rechercherItineraire();
        }
    }

    const editItineraire = async (id) => {
        setEditModif(id);
        try {
            await axios.get(`http://localhost:5077/api/Itineraire/edit-itineraire/${id}`).then(({ data }) => {
                console.log("data :", data);
                data.map(element => {
                    setEditId(element.id);
                    setEditLieudepart(element.liueDepart);
                    setEditLieuarrivee(element.lieuArrivee);
                    setEditLieuseparateur(element.lieuSeparteur);
                    setEditStatut(element.statut);
                })
            })
            setOpen(true);
        } catch (error) {
            console.log("erreur :", error);
        }
    }

    const modifierItineraire = async (e) =>{
        console.log("id :", editModif);
          e.preventDefault();
          const formData = new FormData();
          formData.append("liueDepart", editLieudepart)
          formData.append("lieuArrivee", editLieuarrivee)
          formData.append("lieuSeparteur", editLieuseparateur)
          formData.append("statut", editStatut)
          if (editLieudepart === "" || editLieuarrivee === "") {
               setMessageEdit(<label className='text-danger'>Renseigner le champ</label>)
          } else if (editStatut === "Non direct" && editLieuseparateur === "") {
            setMessageEdit(<label className='text-danger'>Le point intermédiaire est obligatoire: Lieu separateur</label>)
        }
          else{
             try {
                await axios.post(`http://localhost:5077/api/Itineraire/modification-itineraire?Id=${editModif}`, 
                formData,
                {headers:{'Content-Type': 'application/json'}}
                ).then(({data}) =>{
                    setMessageItineraire(<label className='text-success'>{data}</label>)
                    setTimeout(() => {
                        setMessageItineraire("");
                    }, 5000);
                })
                setEditLieudepart("");
                setEditLieuarrivee("");
                setEditId("");
                setEditStatut("");
                setOpen(false);
             } catch (error) {
                
             }
          }
    }
    return (
        <div>
            <Menu />
            <div className='itineraires mt-2'>
                <Form onSubmit={ajouterItineraire}>
                    <div className='formulaire-itineraire'>
                        <div className='form-group'>
                            <FormLabel className='label-itineraire text-primary'>Lieu de départ : </FormLabel>
                            <TextField
                                type='text'
                                placeholder='saisir un lieu de départ'
                                value={liueDepart}
                                onChange={(e) => setLieuDepart(e.target.value)}
                                size='small'
                            />
                        </div>
                        <div className='form-group'>
                            <FormLabel className='label-itineraire text-primary'>Lieu d'arrivée : </FormLabel>
                            <TextField
                                type='text'
                                placeholder="saisir un lieu d'arrivée"
                                value={lieuArrivee}
                                onChange={(e) => setLieuArrivee(e.target.value)}
                                size='small'
                            />
                        </div>
                        <FormLabel className='label-itineraire text-primary' style={{ marginTop: '10px' }}>Statut : </FormLabel>
                        <div className='form-group' id='select-item'>
                            <select className='form-control w-100' value={statut} onChange={(e) => setStatut(e.target.value)}>
                                <option value="Sélectionner">Sélectionner</option>
                                <option value="Direct">Direct</option>
                                <option value="Non direct">Non direct</option>
                            </select>
                        </div>
                        <div className='form-group' style={{ display: (statut !== "Non direct") ? 'none' : 'block' }}>
                            <FormLabel className='label-itineraire text-primary'>Intermédiaire : </FormLabel>
                            <TextField
                                type='text'
                                placeholder='saisir un lieu separateur'
                                value={lieuSeparteur}
                                onChange={(e) => setLieuSepparateur(e.target.value)}
                                size='small'
                            />
                        </div>
                        <div>
                            <button style={{ margin: '10px' }} className='btn btn-primary'>ENREGISTRER</button>
                        </div>
                    </div>
                </Form>
                <div className='affichage-itineraire'>
                    <header className='header-itineraire'>
                        <label className='text text-primary' style={{ fontSize: '1.2em' }}>Liste des itineraires</label>
                        <label style={{ fontSize: '1.2em' }}>{messageItineraire}</label>
                        <TextField
                            type='text'
                            placeholder='rechercher...'
                            value={rechercherInput}
                            onChange={(e) => setRechercheInput(e.target.value)}
                            size='small'
                            sx={{ width: '50%' }}
                            InputProps={
                                {
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <AiIcons.AiOutlineSearch></AiIcons.AiOutlineSearch>
                                        </InputAdornment>
                                    )
                                }
                            }
                        />
                    </header>
                    <div className='tableau-itineraire'>
                        <Table striped  hover variant="darkgray" className='table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>LIEU DE DEPART</th>
                                    <th>LIEU D'ARRIVEE</th>
                                    <th>POINT INTERMEDIAIRE</th>
                                    <th>STATUT</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    donneItineraire.length > 0 && (
                                        donneItineraire.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.id}</td>
                                                <td>{item.liueDepart}</td>
                                                <td>{item.lieuArrivee}</td>
                                                <td>{(item.lieuSeparteur === "") ? '-' : item.lieuSeparteur}</td>
                                                <td>{item.statut}</td>
                                                <td style={{ width: '50px' }}>
                                                    <Link style={{ margin: '10px' }}>
                                                        <AiIcons.AiFillEdit size={20} onClick={() => editItineraire(item.id)}></AiIcons.AiFillEdit>
                                                    </Link>
                                                    <Link >
                                                        <AiIcons.AiFillDelete size={20} color='red' onClick={() => ConfirSupprimer(item.id)}></AiIcons.AiFillDelete>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                            <tfoot>
                                {
                                    (donneItineraire.length === 0) ? (<tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>
                                            <span className='text-danger' style={{ fontSize: '1.3em' }}>Aucune donnée n'est trouvée</span>
                                        </td>
                                    </tr>) : ''
                                }
                            </tfoot>
                        </Table>
                    </div>
                </div>
                <Modal
                    open={open}
                    disablePortal={true}
                >
                    <Form onSubmit={modifierItineraire}>
                        <Box sx={style}>
                            <label className='text-danger' style={{ fontSize: '1.2em' }}>
                                Informations de la modification Id : {editId}</label>
                            <div className='flex'>
                                <div className='form-group mt-2'>
                                    <label>Lieu de départ</label>
                                    <input type='text' value={editLieudepart}
                                        className='form-control' onChange={(e) => setEditLieudepart(e.target.value)}></input>
                                </div>
                                <div className='form-group mt-2'>
                                    <label>Lieu d'arrivée</label>
                                    <input type='text' value={editLieuarrivee}
                                        className='form-control' onChange={(e) => setEditLieuarrivee(e.target.value)}></input>
                                </div>
                                <div className='form-group mt-2'>
                                    <label>Statut</label>
                                    <select value={editStatut}
                                        className='form-control' onChange={(e) => setEditStatut(e.target.value)}>
                                        <option value="Direct">Direct</option>
                                        <option value="Non direct">Non direct</option>
                                    </select>
                                </div>
                                <div className='form-group mt-2' style={{ display: editStatut === "Direct" ? 'none' : 'block' }}>
                                    <label>Lieu separateur</label>
                                    <input type='text' value={editLieuseparateur}
                                        className='form-control' onChange={(e) => setEditLieuseparateur(e.target.value)}></input>
                                </div>
                                <label>{messageEdit}</label>
                                <div className='form-group mt-2 flex'>
                                    <button className='btn btn-primary'>Modifier</button>
                                    <Link onClick={() => setOpen(false)}
                                        style={{ float: 'right', textDecoration: 'none', fontSize: '1.3em' }}>
                                        Fermer
                                    </Link>
                                </div>
                            </div>
                        </Box>
                    </Form>
                </Modal>
                <Dialog
                 open={openDialog}
                 disablePortal={true}
                 sx={styleDialog}
                >
                  <DialogTitle>Informations</DialogTitle>
                  <DialogContentText sx={{margin: '10px'}}>
                    Vous êtes sûr de vouloir supprimer 
                    <AiIcons.AiFillQuestionCircle size={50}></AiIcons.AiFillQuestionCircle>
                  </DialogContentText>
                  <DialogActions>
                    <Button onClick={supprimerItineraire}>Oui</Button>
                    <Button className='btn btn-danger' onClick={() =>setopenDialog(false)}>Non</Button>
                  </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}
const style = {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 2,
    pb: 3,
    border: 'none',
};
const styleDialog = {
    position: 'absoulute',
    top: -150,

}

export default Itineraire