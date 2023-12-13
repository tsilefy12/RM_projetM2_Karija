import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import './Vol.css'
import { Link } from 'react-router-dom'
import { Box, Dialog, DialogActions, DialogContentText, DialogTitle, FormGroup, FormLabel, InputAdornment, Modal, TextField } from '@mui/material'
import { Form, Table, Button } from 'react-bootstrap'
import * as AiIcons from "react-icons/ai"
import axios from 'axios'

function Vol() {
  const [donneVol, setDonneVol] = useState([]);
  const [open, setOpen] = useState(false);
  const [avionId, setAvionId] = useState("");
  const [capaciteMax, setCapaciteMax] = useState("");
  const [itineraire, setItineraire] = useState("");
  const [dateDepart, setDateDepart] = useState("");
  const [dateArrivee, setDateArrivee] = useState("");
  const [heureDepart, setHeureDepart] = useState("");
  const [messageVol, setMessageVol] = useState("");
  const [messageDelete, setMessageDelete] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [a, setA] = useState("");

  const [displayDiv, setDispalydiv] = useState(false);
  const [editNumeroAvion, setEditNumeroAvion] = useState("");
  const [editCapaciteMax, setEditCapaciteMax] = useState("");
  const [editItineraire, setEditItineraire] = useState("");
  const [editDatedepart, setEditDatedepart] = useState("");
  const [editDatearrivee, setEditDatearrivee] = useState("");
  const [editHeuredepart, setEditHeurdepart] = useState("");
  const [messageEdit, setMessageEdit] = useState("");
  const [editIdVol, setEditIdVol] = useState("");
  const [inputRecherche, setInputRecherche] = useState("");
  const [donneIti, setDonneIti] = useState([]);
  const [donneIdAvion, setDonneIdAvion] = useState([]);


  useEffect(() => {
    afficherVol();
    verificationRechercher();
    donneItineraire();
    selectIdAvion();
    selectCapaciteAvion();
  })

  const afficherVol = async () => {
    try {
      await axios.get('http://localhost:5077/api/Vol').then(({ data }) => {
        setDonneVol(data);
      })
    } catch (error) {
      throw (error);
    }
  }
  const rechercherVol = async () => {
    try {
      await axios.get(`http://localhost:5077/api/Vol/rechercher-vol?recherche=${inputRecherche}`).then(({ data }) => {
        setDonneVol(data);
      })
    } catch (error) {
      throw (error)
    }
  }
  const verificationRechercher = () => {
    if (inputRecherche === "") {
      afficherVol();
    } else {
      rechercherVol();
    }
  }
  const ajoutVol = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avionId", avionId);
    formData.append("capaciteMax", capaciteMax);
    formData.append("idItineraire", itineraire);
    formData.append("dateDepart", dateDepart);
    formData.append("dateArrivee", dateArrivee);
    formData.append("heureDepart", heureDepart + ":00");
    if (avionId == "" || capaciteMax == "" || itineraire == ""
      || dateDepart == "" || dateArrivee == "" || heureDepart == "" || avionId === "Sélectionner") {
      setMessageVol(<label className='text-danger'>Tous les champs sont obligatoires</label>)
    } else {
      try {
        await axios.post('http://localhost:5077/api/Vol/ajout-vol',
          formData, { headers: { 'Content-Type': 'application/json' } }).then(({ data }) => {
            setMessageVol(<label className='text-success'>{data}</label>)
          })
        afficherVol();
        setAvionId("Sélectionner");
        setCapaciteMax("");
        setItineraire("");
        setDateArrivee("");
        setDateDepart("");
        setHeureDepart("");
        setTimeout(() => {
          setOpen(false)
        }, 5000);
      } catch (error) {
        throw (error);
      }
    }
  }

  const supprimerVol = async (idVol) => {
    try {
      await axios.delete(`http://localhost:5077/api/Vol/supprimer-vol?id=${idVol}`).then(({ data }) => {
        setMessageDelete(<label className='text-danger'>{data}</label>)
      })
      afficherVol();
      setOpenDialog(false)
      setTimeout(() => {
        setMessageDelete("");
      }, 15000);
    } catch (error) {
      throw (error);
    }
  }

  const ConfirmeSuppression = (s) => {
    setA(s)
    setOpenDialog(true)
  }

  const editVol = async (editId) => {
    try {
      await axios.post(`http://localhost:5077/api/Vol/edit-vol/${editId}`).then(({ data }) => {
        console.log("data edit : ", data);
        data.map(element => {
          setEditNumeroAvion(element.avionId);
          setEditCapaciteMax(element.capaciteMax);
          setEditItineraire(element.idItineraire);
          setEditDatedepart(element.dateDepart);
          setEditDatearrivee(element.dateArrivee);
          setEditHeurdepart(element.heureDepart);
        })
      })
      setDispalydiv(true);
      setEditIdVol(editId);
    } catch (error) {
      throw (error);
    }
  }

  const modifierVol = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avionId", editNumeroAvion);
    formData.append("capaciteMax", editCapaciteMax);
    formData.append("idItineraire", editItineraire);
    formData.append("dateDepart", editDatedepart);
    formData.append("dateArrivee", editDatearrivee);
    formData.append("heureDepart", editHeuredepart);

    if (editNumeroAvion == "" || editCapaciteMax == "" || editItineraire == ""
      || editDatedepart == "" || editDatearrivee == "" || editHeuredepart == "") {
      setMessageEdit(<label className='text-danger'>Veuillez renseigner les champs.</label>)
    } else {
      try {
        await axios.post(`http://localhost:5077/api/Vol/modification-vol/${editIdVol}`,
          formData, { headers: { 'Content-Type': 'application/json' } }
        ).then(({ data }) => {
          setMessageEdit(<label className='text-success'>{data}</label>);
        })
        setTimeout(() => {
          setDispalydiv(false);
          setMessageEdit("");
        }, 4000);
        afficherVol();
      } catch (error) {
        throw (error);
      }
    }
  }
  const donneItineraire = async () => {
    await axios.get('http://localhost:5077/api/Itineraire').then(({ data }) => {
      setDonneIti(data);
    })
  }

  const selectIdAvion = async () =>{
    await axios.get('http://localhost:5077/api/Avion/num-avion').then(({data}) =>{
        setDonneIdAvion(data);
    })
  }

  const selectCapaciteAvion = async () =>{
    if (avionId === "") {
       setCapaciteMax("");
    } else {
      await axios.get(`http://localhost:5077/api/Avion/num-avion/${avionId}`).then(({data}) =>{
          setCapaciteMax(data);
    })
    }

  }
  return (
    <div>
      <Menu />
      <div className='vols'>
        <div className='entete-vol'>
          <header className='header-vol'>
            <label className='text-primary' style={{ fontWeight: 'bold', fontSize: '0.8em' }}>
              BIENVENUE SUR CETTE PAGE DE VOL DANS VOTRE COMPAGNIE
            </label>
            <div className='form-group boutton-vol'>
              <button className='btn btn-primary' onClick={() => setOpen(true)}>AJOUTER NOUVEAU VOL</button>
              <Link to={'/'}>PAGE D'ACCUEIL</Link>
            </div><br></br><br></br><br></br><br></br>
            <div className='logo-vol'>
            </div>
            <div className='mini-tableau mt-2' style={{display: displayDiv ? 'none': 'block'}}>
              <Table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Lieu de départ</th>
                    <th>Lieu d'arrivée</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    donneIti.length > 0 && (
                      donneIti.map((elem, i) => (
                        <tr key={i}>
                          <td>{elem.id}</td>
                          <td>{elem.liueDepart}</td>
                          <td>{elem.lieuArrivee}</td>
                          <td>{elem.statut}</td>
                        </tr>
                      ))
                    )
                  }
                </tbody>
              </Table>
            </div>
          </header>
        </div>
        <div className='containere afficher-vol mt-2'>
          <div className='card tableau-avion-card' style={{
            marginLeft: '3px',
            display: !displayDiv ? 'block' : 'none'
          }}>
            <div className='card-header entete-affichage-vol'>
              <label style={{ fontSize: '1.3em' }} className='text-primary'>Liste des vols </label>
              <label style={{ fontSize: '1.3em' }}>{messageDelete}</label>
              <TextField
                type='text'
                placeholder='rechercher un vol'
                size='normal'
                value={inputRecherche}
                onChange={(e) => setInputRecherche(e.target.value)}
                InputProps={
                  {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <AiIcons.AiOutlineSearch />
                      </InputAdornment>
                    )
                  }
                }
              />
            </div>
            <div className='card-body body-afficher-vol'>
              <Table striped hover variant="darkgray" className='table'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>AVION ID</th>
                    <th>DATE DEPART</th>
                    <th>DATE D'ARRIVEE</th>
                    <th>HEURE DE DEPART</th>
                    <th>CAPACITE</th>
                    <th>LIEU DE DEPART</th>
                    <th>LIEU D'ARRIVEE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    donneVol.length > 0 && (
                      donneVol.map((item, index) => (
                        <tr key={index}>
                          <td>{item.vol.id}</td>
                          <td>{item.vol.avionId}</td>
                          <td>{(item.vol.dateDepart).split('T')[0]}</td>
                          <td>{(item.vol.dateArrivee).split('T')[0]}</td>
                          <td>{item.vol.heureDepart}</td>
                          <td>{item.vol.capaciteMax}</td>
                          <td>{item.itineraire.liueDepart}</td>
                          <td>{item.itineraire.lieuArrivee}</td>
                          <td style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Link>
                              <AiIcons.AiFillEdit onClick={() => editVol(item.vol.id)} />
                            </Link>
                            <Link>
                              <AiIcons.AiFillDelete onClick={() => ConfirmeSuppression(item.vol.id)} />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )
                  }
                </tbody>
              </Table>
            </div>
          </div>

          {/* <label>Modifier vol</label> */}
          <Form onSubmit={modifierVol}>
            <div style={{
              display: displayDiv ? 'block' : 'none', margin: '30px',
              backgroundColor: 'rgb(245, 239, 239)', padding: '20px'
            }} className='formulaire-edit-vol'>
              <div>
                <FormGroup sx={{ marginTop: '10px' }}>
                  <FormLabel className='text-primary'>Numéro d'un avion</FormLabel>
                  <TextField
                    type='text'
                    placeholder="numéro d'avion"
                    size='normal'
                    value={editNumeroAvion}
                    onChange={(e) => setEditNumeroAvion(e.target.value)}
                  />
                </FormGroup>
                <FormGroup sx={{ marginTop: '10px' }}>
                  <FormLabel className='text-primary'>Capacité</FormLabel>
                  <TextField
                    type='number'
                    placeholder="capacité"
                    size='normal'
                    inputProps={{ min: 0 }}
                    value={editCapaciteMax}
                    onChange={(e) => setEditCapaciteMax(e.target.value)}
                  />
                </FormGroup>
                <FormGroup sx={{ marginTop: '10px' }}>
                  <FormLabel className='text-primary'>Numéro d'itineraire</FormLabel>
                  <TextField
                    type='number'
                    placeholder="numéro d'itineraire"
                    size='normal'
                    inputProps={{ min: 0 }}
                    value={editItineraire}
                    onChange={(e) => setEditItineraire(e.target.value)}
                  />
                </FormGroup>
              </div>
              <div>
                <FormGroup sx={{ marginTop: '10px' }}>
                  <FormLabel className='text-primary'>Date de départ</FormLabel>
                  <TextField
                    type='date'
                    size='small'
                    value={editDatedepart.split('T')[0]}
                    onChange={(e) => setEditDatedepart(e.target.value)}
                  />
                </FormGroup>
                <FormGroup sx={{ marginTop: '10px' }}>
                  <FormLabel className='text-primary'>Date d'arrivée</FormLabel>
                  <TextField
                    type='date'
                    placeholder="date d'arrivée"
                    size='small'
                    value={editDatearrivee.split('T')[0]}
                    onChange={(e) => setEditDatearrivee(e.target.value)}
                  />
                </FormGroup>
                <FormGroup sx={{ marginTop: '10px' }}>
                  <FormLabel className='text-primary'>Heure de départ -- format(Heure:minute:seconde)</FormLabel>
                  <TextField
                    type='time'
                    placeholder="Heure de départ"
                    size='small'
                    value={editHeuredepart}
                    onChange={(e) => setEditHeurdepart(e.target.value)}
                  />
                </FormGroup>
              </div>
              <div className='form-group' style={{ float: 'right', padding: '20px' }}>
                <label style={{ fontSize: '1.3em', marginRight: '10px' }}>{messageEdit}</label>
                <button className='btn btn-primary' style={{ margin: '6px' }}>Enregistrer les modifications</button>
                <button className='btn btn-danger' onClick={() => setDispalydiv(false)}>Retour à la liste</button>
              </div>
            </div>
          </Form>
        </div>

        {/* <label>Ajout vol</label> */}
        <Modal
          open={open}
          disablePortal={true}
        >
          <Form onSubmit={ajoutVol}>
            <Box sx={style}>
              <FormLabel>{messageVol}</FormLabel>
              <FormGroup className='mt-2'>
                <FormLabel>Numéro d'un avion</FormLabel>
                <select className='form-control' onChange={(e) =>setAvionId(e.target.value)}>
                  <option value="Sélectionner">Sélectionner</option>
                  {
                     donneIdAvion.length > 0 &&(
                      donneIdAvion.map(a =>(
                        <option value={a.numeroAvion}>{a.numeroAvion}</option>
                      ))
                     )
                  }
                </select>
              </FormGroup>
              <FormGroup className='mt-2'>
                <FormLabel>Capacité max</FormLabel>
                <TextField
                  type='number'
                  placeholder='saisir la capacité'
                  size='normal'
                  inputProps={{ min: 0 }}
                  value={capaciteMax}
                  onChange={(e) => setCapaciteMax(e.target.value)}
                />
              </FormGroup>
              <FormGroup className='mt-2'>
                <FormLabel>Numéro d'itineraire</FormLabel>
                <select className='form-control' value={itineraire} onChange={(e) =>setItineraire(e.target.value)}>
                  <option value="">Sélectionner</option>
                  {
                     donneIti.length > 0 &&(
                      donneIti.map(a =>(
                        <option value={a.id}>{a.id}</option>
                      ))
                     )
                  }
                </select>
              </FormGroup>
              <FormGroup className='mt-2'>
                <FormLabel>Date départ</FormLabel>
                <TextField
                  type='date'
                  placeholder='saisir la date de départ'
                  size='small'
                  value={dateDepart}
                  onChange={(e) => setDateDepart(e.target.value)}
                />
              </FormGroup>
              <FormGroup className='mt-2'>
                <FormLabel>Date d'arrivée</FormLabel>
                <TextField
                  type='date'
                  placeholder="saisir la date d'arrivée"
                  size='small'
                  value={dateArrivee}
                  onChange={(e) => setDateArrivee(e.target.value)}
                />
              </FormGroup>
              <FormGroup className='mt-2'>
                <FormLabel>Heure de départ</FormLabel>
                <TextField
                  type='time'
                  placeholder="saisir l'heure de départ du vol"
                  size='small'
                  value={heureDepart}
                  onChange={(e) => setHeureDepart(e.target.value)}
                />
              </FormGroup>
              <FormGroup className='mt-2'>
                <button className='btn btn-primary grow'>AJOUTER UN VOL</button>
                <button className='btn btn-danger mt-2 grow' onClick={() => setOpen(false)}>FERMER</button>
              </FormGroup>
            </Box>
          </Form>
        </Modal>
        <Dialog
          open={openDialog}
          disablePortal={true}
          sx={styleDialog}
        >
          <DialogTitle className='text-danger'>Informations</DialogTitle>
          <DialogContentText sx={{ margin: '10px' }}>
            Voulez-vous supprimer le vol
            <AiIcons.AiFillQuestionCircle size={50} />
          </DialogContentText>
          <DialogActions sx={{ margin: '10px' }}>
            <Button onClick={() => supprimerVol(a)} className='btn btn-primary'>Oui</Button>
            <Button onClick={() => setOpenDialog(false)} className='btn btn-danger'>Non</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}
const style = {
  position: 'absolute',
  top: '45%',
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
  top: -150,
}
export default Vol