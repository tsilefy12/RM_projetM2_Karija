import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import '../VenteBillets/VenteBillet.css'
import { TextField,InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material'
import { Image } from 'react-bootstrap'
import logoBillet from '../../images/téléchargement (5).png'
import logoTicket from '../../images/téléchargement (6).jpg'
import axios from 'axios'
import * as AiIcons from "react-icons/ai"
import {AiOutlineSearch} from "react-icons/ai"

function Vente() {
  const [donneVente, setDonneVente] = useState([]);
  const [inputRechercher, setInputRechercher] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [msgDialog, setMsgDialog] = useState(false);
  const [idB, setId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    conditionRecherche();
  })

  const affichageVente = async () => {
    await axios.get(`http://localhost:5077/api/Vente/afficher-vente`).then(({ data }) => {
        setDonneVente(data);
    })
  }
  const RechercherBillet = async () => {
    await axios.get(`http://localhost:5077/api/Vente/rechercher-billet/${inputRechercher}`).then(({ data }) => {
    
        setDonneVente(data);
    })
  }

  const conditionRecherche = () =>{
    if (inputRechercher == "") {
      affichageVente();
    } else {
      RechercherBillet();
    }
  }
  const supprimer = async (Id) =>{
    await axios.delete(`http://localhost:5077/api/Vente/supprimer-billet/${Id}`).then(({data}) =>{
      setMsgDialog(true);
      const messagedata = (<label className='text-success'>{data}</label>);
      setMessage(messagedata);
    })
    setOpenDialog(false);
    affichageVente();
  }
  const deleteBillet = (d) =>{
    setOpenDialog(true);
    setId(d);
  }
  const fermerMessageDialog = ()=>setMsgDialog(false);
  // const datyFormat = () =>{
  //   var dateee = document.getElementsByClassName('dateT').innerHTML;
  //     console.log("date t ", dateee);
  // }
  return (
    <div className='vente-billet-liste'>
      <Menu />
      <div className='flex-box'>
        <header className='header-billet-vente'>
          <label className='text-info' style={{ marginLeft: '38px' }}>Liste de billets par passager</label>
          <span className='text-primary' style={{ marginLeft: '38px', marginTop: '30px' }}>{
              (donneVente.length == 0 && inputRechercher == "")? (<label className='text-danger'>Aucun client n'est pas prêt à voyger</label>) : 
              (donneVente.length == 1) ? (<label>1 client trouvé</label>) : donneVente.length > 1 ?
              (<label>{donneVente.length} clients trouvés</label>) : (<label className='text-danger'></label>)
          }</span>
          <TextField
            type='text'
            placeholder='rechercher...'
            value={inputRechercher}
            onChange={(e) => setInputRechercher(e.target.value)}
            sx={{ float: 'right', marginLeft: '38px', marginTop: '30px', width: '44%' }}
            className='rechercher-vente-billet'
            inputProps={
              {
                endAdornment: (
                  <InputAdornment position='end'>
                    <AiIcons.AiOutlineSearch/>
                  </InputAdornment>
                )
              }
            }
          />
        </header>
        {/* <button onClick={() =>datyFormat()}>save</button> */}
        <div className='billet-vendu'>
          {
            donneVente.length > 0 && (
              donneVente.map((item, index) => (
                <div className='card billet-carte' key={index}>
                  <div className='card-header vente-header'>
                    <label>ID : {item.idVente}
                    </label>
                    <span className='text-primary' style={{cursor: 'pointer'}} onClick={() =>deleteBillet(item.idVente)}>Enlever</span>
                    <Image src={logoBillet} width={100} height={50}></Image>
                  </div>
                  <div className='card-body body-vente'>
                    <label>Numéro passger : {item.passagerId}</label>
                    <label>Nom du propriétaire : {item.statutPaiement}</label>
                    <label>Mode paiement : {item.modePaiement}</label>
                    <label>Numéro vol : {item.numerov}</label>
                  </div>
                  <div className='card-footer footer-vente'>
                    <Image src={logoTicket} width={130} height={35}></Image>
                    <label style={{ marginLeft: '4px' }} className='dateT'>Date : {item.dateTransaction.split('T')[0]}</label>
                  </div>
                </div>
              ))
            )
          }
          {
             (donneVente.length == 0 &&  inputRechercher !="")&& (
              <label className='text-danger' style={{margin: '20%'}}>
              Il n'y a pas de billet enregistré qui correspond à votre recherche</label>
             )
          }
        </div>
        
      </div>
      <Dialog
      open={openDialog}
      disablePortal={true}
      sx={dialog}
      >
        <DialogTitle className='text-danger'>
          Information
        </DialogTitle>
        <DialogContent>
          Vous êtes sûr de vouloir supprimer ça
         <AiIcons.AiFillQuestionCircle size={45} color='#800000' style={{marginLeft: '4px'}}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() =>supprimer(idB)}>Oui</Button>
          <Button onClick={() =>setOpenDialog(false)}>Non</Button>
        </DialogActions>
      </Dialog>
      <Dialog
      open={msgDialog}
      disablePortal={true}
      sx={dialogMessage}
      >
      <AiIcons.AiOutlineClose size={23} onClick={() =>fermerMessageDialog()} 
        style={{marginLeft: '90%', cursor: 'pointer'}}/>
        <DialogTitle className='text-danger'>Information</DialogTitle>
        <DialogContentText sx={{margin: '20px'}}>{message}</DialogContentText>
        
      </Dialog>
    </div>

  )
}
const dialog = {
  top: -150,
}
const dialogMessage = {
  top: -150,
}

export default Vente