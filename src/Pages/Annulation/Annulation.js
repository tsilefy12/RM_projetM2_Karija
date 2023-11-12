import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import '../Annulation/Annulation.css'
import { AiFillDelete, AiFillEdit, AiFillNotification, AiFillPlusCircle, AiFillQuestionCircle, AiOutlineClose, AiOutlineNotification, AiOutlineSearch, AiTwotoneNotification } from 'react-icons/ai'
import { TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, Modal, Box } from '@mui/material'
import axios from 'axios'
import NotificationIcon from '@mui/icons-material/NotificationImportant';
import { Form } from 'react-bootstrap'

function Annulation() {
  const [donneAnnulation, setDonneAnnulation] = useState([]);
  const [donneValide, setDonneValide] = useState([]);
  const [compter, setCount] = useState("");
  const [valid, setValid] = useState("");
  const [valEdit, setValEdit] = useState("");
  const [recherche, setRecherche] = useState("");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openValidation, setOpenValidation] = useState(false);
  const [messageModif, setMessageModif] = useState("");


  useEffect(() => {
    validationInput();
    countValid();
  })
  const affichageAnnulation = async () => {
    await axios.get(`http://localhost:5077/api/Annulation`).then(({ data }) => {
      setDonneAnnulation(data);
    })
  }
  const RechercherAnnulation = async () => {
    await axios.get(`http://localhost:5077/api/Annulation/recherche-demande-annulation/${recherche}`).then(({ data }) => {
      setDonneAnnulation(data);
    })
  }
  const validationInput = () => {
    if (recherche == "") {
      affichageAnnulation();
    } else {
      RechercherAnnulation();
    }
  }

  const supprimer = async (id) => {
    await axios.delete(`http://localhost:5077/api/Annulation/supprimer-demande/${id}`).then(({ data }) => {
      setOpen(true);
      const msg = (<label className='text-success'>{data}</label>);
      setMessage(msg);
    })
    setOpenDialog(false);
    affichageAnnulation();
  }

  const deleteCondition = (a) => {
    setOpenDialog(true);
    setContact(a)
  }
  const detailsListe = async (MailAdresse) => {
    try {
      const response = await axios.get(`http://localhost:5077/api/Annulation/vue-annulation/${MailAdresse}`);
      const data = response.data;
  
      setDonneValide(data);
      setOpenDetail(true);
  
      console.log("donne :", MailAdresse);
      console.log("data ", donneAnnulation);
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des données :", error);
    }
  }
  
  const edit = async (mail) => {
    await axios.get(`http://localhost:5077/api/Annulation/edit-validation-annulation/${mail}`).then(({ data }) => {
      const donne = data[0];
      setOpenValidation(true);
      setValid(donne.valide);
    })

    console.log("edit value :", mail);
    setValEdit(mail);
  }
  const modifier = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("mailaka", "string");
    formData.append("nomP", "string");
    formData.append("phone", 0);
    formData.append("numVol", "string");
    formData.append("dateVoyage", "2023-11-01T07:26:39.869Z");
    formData.append("heureVoyage", "00:00:00");
    formData.append("motif", "string");
    formData.append("methodePaiement", "string");
    formData.append("dateTrans", "2023-11-01T07:26:39.869Z");
    formData.append("numTrans", 0);
    formData.append("dateDemande", "2023-11-01T07:26:39.869Z");
    formData.append("valide", valid);
    await axios.post(`http://localhost:5077/api/Annulation/modifier-validation/${valEdit}`,
      formData, { headers: { 'Content-Type': 'application/json' } }).then(({ data }) => {
        console.log("message :", data);
        const mss = (<label className='text-success'>{data}</label>);
        setMessageModif(mss);
      })
    affichageAnnulation();
    setOpenValidation(false);
    setTimeout(() => {
      setMessageModif("");
    }, 5000);
  }
  const countValid = async () => {
    await axios.get(`http://localhost:5077/api/Annulation/count-nonValid`).then(({ data }) => {
      const donne = data.length;
      setCount(donne);
    })
  }
  return (
    <div className='annulation-liste'>
      <Menu />
      <div>
        <header className='text-info header-annulation-liste'>
          LISTE DE DEMANDES D'ANNULATION : {donneAnnulation.length}
          <div className='notif-recherchre' style={{ float: 'right' }}>
            <label>
              <NotificationIcon style={{ fontSize: '30px', marginTop: '-15%' }} /><sup className='text-danger'
                style={{ fontSize: '0.85em', marginLeft: '-15px' }}>
                {compter}</sup></label>
            <TextField
              type='text'
              placeholder='rechercher...'
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              id='text'
              InputProps={
                {
                  endAdornment: (
                    <InputAdornment position='start'>
                      <AiOutlineSearch />
                    </InputAdornment>
                  )
                }
              }
            />
          </div>
          <hr></hr>
        </header>
        <label style={{marginLeft: '20px'}}>{messageModif}</label>
        <div className='toutes-liste-demandes'>
          {
            donneAnnulation.length > 0 && (
              donneAnnulation.map((item, index) => (
                <div className='liste-demande-client' key={index}>
                  <label style={{ marginLeft: '4%', marginTop: '5%' }}>Nom : {item.nomP}</label>
                  <label style={{ marginLeft: '4%' }}>Numéro vol : {item.numVol}</label>
                  <label style={{ marginLeft: '4%' }}>Motif : {item.motif}</label>
                  <label style={{ marginLeft: '4%' }}>Validation: {item.valide}</label>
                  <label style={{ marginLeft: '4%' }}>Date de demande : {item.dateDemande.split('T')[0]}</label>
                  <div className='flex' style={{ marginLeft: '4%', marginTop: '4%', width: '88%' }}>
                    <span style={{ cursor: 'pointer' }}>
                      <AiFillPlusCircle size={20} onClick={() => detailsListe(item.mailaka)} />
                    </span>
                    <span style={{ cursor: 'pointer', marginLeft: '10%' }}>
                      <AiFillEdit size={20} onClick={() => edit(item.mailaka)} />
                    </span>
                    <span style={{ cursor: 'pointer', marginLeft: '10%' }}>
                      <AiFillDelete size={20} onClick={() => deleteCondition(item.phone)} />
                    </span>
                  </div>
                </div>
              ))
            )
          }
          {
            (donneAnnulation.length == 0 && recherche != "") && (<label className='text-danger' style={{ margin: '20%' }}>Aucune demande d'annulation trouvée</label>)
          }
        </div>

      </div>
      <Dialog
        open={openDialog}
        disablePortal={true}
        sx={styleDialog}
      >
        <DialogTitle className='text-danger'>Information</DialogTitle>
        <DialogContent className='text-danger'>Vous êtes sûr <AiFillQuestionCircle size={40} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => supprimer(contact)}>Oui</Button>
          <Button onClick={() => setOpenDialog(false)}>Non</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        disablePortal={true}
        sx={messageDialog}
      >
        <AiOutlineClose size={20} onClick={() => setOpen(false)} style={{ marginLeft: '95%', cursor: 'pointer' }} />
        <DialogContentText style={{ margin: '20px' }}>{message}</DialogContentText>
      </Dialog>
      <Modal
        open={openDetail}
        disablePortal={true}
      >
        <Box sx={style}>
          <div>
            Détails
            <AiOutlineClose size={25} style={{ float: 'right', cursor: 'pointer' }} onClick={() => setOpenDetail(false)} />
          </div>
          <hr></hr>
          {
            donneValide.length == 1 && (
              donneValide.map((element, index) => (
                <div className='details-liste-annulation' key={index}>
                  {/* <label>Adresse mail : {element.mailaka}</label> */}
                  <label>Nom : {element.nomP}</label>
                  <label>Contact : {element.phone}</label>
                  <label>Numéro vol : {element.numVol}</label>
                  <label>Date de voyage : {element.dateVoyage.split('T')[0]}</label>
                  <label>Heure du voayge : {element.heureVoyage}</label>
                  <label>Motif : {element.motif}</label>
                  <label>Mode paiement : {element.methodePaiement}</label>
                  <label>Montant : {element.numTrans}</label>
                  <label>Date de demande : {element.dateTrans.split('T')[0]}</label>
                  <label>Validation : {element.valide}</label>
                </div>
              ))
            )
          }
        </Box>
      </Modal>
      <Dialog
        open={openValidation}
        disablePortal={true}
        sx={validationStyle}
      >
        <DialogTitle>
          VALIDATION <AiOutlineClose size={20} style={{ float: 'right', cursor: 'pointer' }} onClick={() => setOpenValidation(false)} />
        </DialogTitle>
        <Form onSubmit={modifier}>
          <select
            className='form-control'
            value={valid}
            onChange={(e) => setValid(e.target.value)}
            sx={{ margin: '20px' }}
            type='text'
          >
            <option value='Oui'>Oui</option>
            <option value='Non'>Non</option>
          </select>

          <button style={{ margin: '20px' }} className='btn btn-primary'>Valider</button>
        </Form>
      </Dialog>
    </div>
  )
}
const styleDialog = {
  top: -170,
}
const messageDialog = {
  top: -180
}
const style = {
  position: 'absolute',
  top: '35%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 18,
  pt: 2,
  px: 2,
  pb: 3,
  border: 'none',
};
const validationStyle = {
  top: -300
}
export default Annulation