import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import img from '../Tarification/ajouter.png'
import '../Tarification/Tarif.css'
import { Form } from 'react-bootstrap'
import { TextField, InputAdornment, Modal, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormLabel } from '@mui/material'
import * as AiIcons from "react-icons/ai"
import { Link } from 'react-router-dom'
import axios from 'axios'

function Tarification() {
  const [afficheFormulaire, setAfficheFormulaire] = useState(false);
  const [afficherFormulaireEdit, setAfficheFormulaireEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModaleDialogn, setOpneModalDialog] = useState(false);
  const [donneetarif, setDonneeTarif] = useState([]);
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [nombrePlaceDispoTarif, setNombrePlace] = useState("")
  const [typeTarif, setTypeTarif] = useState("");
  const [statut, setStatut] = useState("");
  const [message, setMessage] = useState("");
  const [lieudep, setLieuDep] = useState("");
  const [lieuAr, setLieuArr] = useState("");

  const [IdEditTarif, setIdEditTarif] = useState("");
  const [editPrix, setEditPrix] = useState("");
  const [editNombrePlace, setEditNombrePlace] = useState("");
  const [editStatut, setEditStatut] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTypeTarif, setEditTypeTarif] = useState("string");
  const [rechercheTarif, setRechercheTarif] = useState("");
  const [idModif, setIdModif] = useState("");
  const [donneLieu, setDonneLieu] = useState([]);

  useEffect(() => {
    AffichageTarification();
  })
  const AfficherTarif = async () => {
    await axios.get(`http://localhost:5077/api/Tarif`).then(({ data }) => {
      setDonneeTarif(data)
    })
  }
  const AjouterTarif = async (e) => {
    e.preventDefault();
    if (description == "" || prix == "" || typeTarif == "" || statut == "") {
      const msg = (<label className='text-danger'>Les champs sont obligatoires</label>);
      setMessage(msg);
      setOpen(true)
    } else {
      await axios.post(`http://localhost:5077/api/Tarif/ajout-tarif`,
        { description, prix, typeTarif, statut, lieudep, lieuAr },
        { headers: { 'Content-Type': 'application/json' } }
      ).then(({ data }) => {
        const msg1 = (<label className='text-success'>{data}</label>);
        setMessage(msg1);
      })
    }
    setOpen(true)
    setDescription("");
    setPrix("");
    setTypeTarif("");
    setNombrePlace("");
    setStatut("");
    AfficherTarif();
    setLieuDep("");
    setLieuArr("");
  }
  const supprimerTarif = async (id) => {
    await axios.delete(`http://localhost:5077/api/Tarif/supprimer-tarif/${id}`).then(({ data }) => {
      setOpen(true)
      const messageSupr = (<label className='text-success'>{data}</label>)
      setMessage(messageSupr);
    })
    setOpneModalDialog(false);
    AfficherTarif();
  }
  const Afficher = () => {
    setAfficheFormulaire(!afficheFormulaire)
  }

  const RechercherTarif = async () => {
    await axios.post(`http://localhost:5077/api/Tarif/recherche-tarif?search=${rechercheTarif}`).then(({ data }) => {
      setDonneeTarif(data);
    })
  }

  const AffichageTarification = () => {
    if (rechercheTarif === "") {
      AfficherTarif();
    } else {
      RechercherTarif();
    }
  }
  const editeTarif = async (edit) => {
    await axios.post(`http://localhost:5077/api/Tarif/edit-tarif?Id=${edit}`).then(({ data }) => {
      data.map((itm) => {
        setEditPrix(itm.prix)
        setEditNombrePlace(itm.nombrePlaceDispoTarif)
        setEditStatut(itm.statut);
        setEditDescription(itm.description)
      })
    })
    setIdEditTarif(edit);
    AfficherEdit();
  }

  const ModifierTarif = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", editDescription);
    formData.append("prix", editPrix);
    formData.append("typeTarif", editTypeTarif)
    formData.append("statut", editStatut);
    formData.append("lieuDep", "string");
    formData.append("lieuAr", "string");

    await axios.post(`http://localhost:5077/api/Tarif/modification-tarif?Id=${IdEditTarif}`,
      formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(({ data }) => {
      setOpen(true);
      const msgModif = (<label className='text-success'>{data}</label>);
      setMessage(msgModif);
    })
    AfficherTarif();
    AfficherEdit(afficherFormulaireEdit);
  }
  const show = afficheFormulaire ? '20vh' : '0vh';
  const miseho = afficheFormulaire ? 'block' : 'none';
  const overflow = afficheFormulaire ? 'auto' : 'auto';
  const AfficherEdit = () => {
    setAfficheFormulaireEdit(!afficherFormulaireEdit);
  }

  const fermerModaleMessage = () => setOpen(false);
  const OpenModalDialog = () => setOpneModalDialog(false);
  const lanceModal = (modif) => {
    setIdModif(modif);
    setOpneModalDialog(true);
  }

  const SelectLieuDepArr = async () => {
    await axios.get(`http://localhost:5077/api/Tarif/selectLieu`).then(({ data }) => {
      setDonneLieu(data);
    })
  }
  return (
    <div>
      <Menu />
      <div className='tarif' style={{ height: !afficheFormulaire ? '100%' : '100%' }}>
        <div className='header-tarif'>
          <header className='text-info'>
            GERER LA TARIFICATION
            <div>
              <TextField className='form-control' style={{ width: "90%" }} placeholder='rechercher...'
                value={rechercheTarif} onChange={(e) => setRechercheTarif(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='start'>
                      <AiIcons.AiOutlineSearch></AiIcons.AiOutlineSearch>
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </header>
        </div>
        <div className='tarif-corps'>
          <div className='formulaire-tarif' style={{
            height: show, transition: 'height 0.5s',
            border: !afficheFormulaire ? 'none' : ''
          }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img src={img} width={40} height={40} onClick={() => Afficher()} className='image-tarif'
                style={{ display: afficherFormulaireEdit ? 'none' : 'block' }}>
              </img><span style={{
                cursor: 'pointer', fontSize: '1.3em', zIndex: 1,
                display: afficherFormulaireEdit ? 'none' : 'block'
              }} className='text-primary nouvel-tarif' onClick={() => Afficher()}>
                Nouveau Tarif</span>
            </div>
            <Form onSubmit={ModifierTarif}>
              <span className='edit-tarif' style={{
                marginLeft: afficherFormulaireEdit ? '0px' : '-200%',
                transition: 'margin-left 0.5s'
              }}>
                <TextField label="Prix" type='number' value={editPrix} onChange={(e) => setEditPrix(e.target.value)} className='input' />
                <TextField label="Statut" value={editStatut} onChange={(e) => setEditStatut(e.target.value)} className='input' />
                <TextField label="Déscription" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className='input' />
                <button className='btn bg-secondary grow'>SAUVEGARDER</button>
              </span>
            </Form>
            <div style={{
              display: miseho, transition: 'opacity 0.5s',
              opacity: afficheFormulaire ? 1 : 0
            }} className='form-tarif'>
              <Form onSubmit={AjouterTarif}>
                <div className='form-tarif-1'>
                  <TextField
                    type='text'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                    placeholder='Déscription du siège, exemple: place réserver pour adultes'
                    autoComplete='off'
                    className='ajout-input'
                  />
                  <TextField
                    type='number'
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    placeholder='prix du siège'
                    autoComplete='off'
                    inputProps={{ min: 0 }}
                    className='ajout-input'
                  />
                  <TextField
                    type='text'
                    value={typeTarif}
                    onChange={(e) => setTypeTarif(e.target.value)}
                    placeholder='type du tarif'
                    className='ajout-input'
                  />
                </div>
                <div className='form-tarif-2'>
                  <TextField
                    type='text'
                    value={lieudep}
                    onChange={(e) => setLieuDep(e.target.value)}
                    placeholder='lieu de depart'
                    className='ajout-input'
                  />
                    <TextField
                    type='text'
                    value={lieuAr}
                    onChange={(e) => setLieuArr(e.target.value)}
                    placeholder="lieu d'arrivéé"
                    className='ajout-input'
                  />
                    <TextField
                    type='text'
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                    placeholder='statut'
                    className='ajout-input'
                  />
                  <button className='btn btn-success' style={{ display: afficherFormulaireEdit ? 'none' : 'block' }}>

                    AJOUTER NOUVEL TARIF</button>
                </div>
              </Form>
            </div>
          </div>
          <div className='tableau-tarif' style={{
            transition: 'margin-top 0.5s',
            height: !afficheFormulaire ? "90%" : '40vh', overflow: overflow,
            display: afficheFormulaire ? 'none' : afficherFormulaireEdit ? 'none' : 'flex', flexDirection: 'column'
          }}>
            <table className='table text-center table-bordered'>
              <thead>
                <tr>
                <th>ID</th>
                  <th>DESCRIPTION</th>
                  <th>PRIX</th>
                  <th>TYPE</th>
                  <th>STATUT DU SIEGE</th>
                  <th>LIEU DE DEPART</th>
                  <th>LIEU D'ARRIVEE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {
                  donneetarif.length > 0 && (
                    donneetarif.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.description}</td>
                        <td>{item.prix}</td>
                        <td>{item.typeTarif}</td>
                        <td>{item.statut}</td>
                        <td>{item.lieuDep}</td>
                        <td>{item.lieuAr}</td>
                        <td style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                          <Link>
                            <AiIcons.AiFillEdit onClick={() => editeTarif(item.id)} />
                          </Link>
                          <AiIcons.AiFillDelete color='red' onClick={() => lanceModal(item.id)} cursor={'pointer'} />
                        </td>
                      </tr>
                    ))
                  )
                }
              </tbody>
            </table>
          </div>
          <Modal
            open={open}
          >
            <Box sx={style}>
              <label>{message}</label>
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <AiIcons.AiOutlineClose onClick={() => fermerModaleMessage()} style={{ cursor: 'pointer' }} size={25} />             </div>
            </Box>
          </Modal>
          <Dialog
            open={openModaleDialogn}
            disablePortal={true}
          >
            <DialogTitle className='text-danger'>Information</DialogTitle>
            <DialogContent>
              <FormLabel>Voulez-vous supprimer cette ligne </FormLabel>
              <AiIcons.AiFillQuestionCircle size={40} /> </DialogContent>
            <DialogActions>
              <Button onClick={() => supprimerTarif(idModif)}>Oui</Button>
              <Button onClick={() => OpenModalDialog(false)}>Annuler</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
const style = {
  position: 'absolute',
  top: '35%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 200,
  height: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 2,
  pb: 3,
  border: 'none',
};

export default Tarification