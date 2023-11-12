import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import '../RemboursementPassager/RemboursementPassager.css'
import axios from 'axios';
import { TextField, InputAdornment, Dialog, DialogTitle, DialogContentText, DialogActions, Button } from '@mui/material';
import { AiFillEdit, AiFillQuestionCircle, AiOutlineSearch, AiTwotoneDelete } from 'react-icons/ai';
import { Form } from 'react-bootstrap';

function RemboursementPassager() {
  const [donneRemboursementP, setDonneRembourseP] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpenDialog] = useState(false);
  const [mailaka, setMailaka] = useState("");
  const [editMail, setEditMail] = useState("");
  const [Id, setId] = useState("");

  useEffect(() => {
    verifier();
  })
  const affichageRemboursement = async () => {
    await axios.get(`http://localhost:5077/api/Remboursement`).then(({ data }) => {
      setDonneRembourseP(data);
    })
  }
  const rechercherRemboursement = async () => {
    if (recherche!="") {
      await axios.get(`http://localhost:5077/api/Remboursement/recherche-remboursement/${recherche}`).then(({ data }) => {
      if (data == "Vous n'avez pas encore effectué la demande de remboursement.") {
        const msg = (<label className='text-danger'>{data}</label>);
        setMessage(msg);
        setDonneRembourseP("");
      } else {
        setDonneRembourseP(data);
        const ok = (<label className='text-success'>Il y a {data.length} résultat trouvé</label>)
        setMessage(ok)
      }
    })
    }
  }
  const verifier = () => {
    if (recherche == "") {
      affichageRemboursement();
    } else {
      rechercherRemboursement();
    }
  }
  const supprimerRemboursement = async (mail) => {
    await axios.delete(`http://localhost:5077/api/Remboursement/suppression-remboursement?mail=${mail}`).then(({ data }) => {
      const messageSupp = (<label className='text-success'>{data}</label>)
      setMessage(messageSupp);
    })
    setOpenDialog(false)
    affichageRemboursement();
    setTimeout(() => {
      setMessage("")
    }, 15000);
  }
  const deleteRem = (e) => {
    setOpenDialog(true);
    setMailaka(e);
  }
  const edit = async (mailadresse) =>{
   await axios.post(`http://localhost:5077/api/Remboursement/edit-remboursement/${mailadresse}`).then(({data}) =>{
    setEditMail(data);
   })
   setId(mailadresse);
  }
  const modif = async (e) =>{
    e.preventDefault();
    if (editMail=="") {
      
    } else {
      const formData = new FormData();
      formData.append("mailAdresse", "string");
      formData.append("nomPass", "string");
      formData.append("modeRemboursement", "string");
      formData.append("pieceJustificative", "string");
      formData.append("telephoneRemboursement", 0);
      formData.append("dateDemandeRemboursement", "2023-11-05T14:18:26.962Z");
      formData.append("verification", editMail);
      await axios.post(`http://localhost:5077/api/Remboursement/modifier-validation/${Id}`
      ,formData, {headers :{'Content-Type': 'application/json'}}).then(({data}) =>{
      const messmodif = (<label className='text-success'>{data}</label>);
      setMessage(messmodif);
    })
    setEditMail("");
    affichageRemboursement();
    setTimeout(() => {
      setMessage("")
    }, 15000);
  }
  }
  return (
    <div className='remboursement-affichage'>
      <Menu />
      <div className='afficher-remboursement'>
        <header style={{ marginLeft: '20px' }} className='entete-remboursement'>
          <TextField
            type='text'
            placeholder='rechercher...'
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            InputProps={
              {
                endAdornment: (
                  <InputAdornment position='end'>
                    <AiOutlineSearch />
                  </InputAdornment>
                )
              }
            }
          />
         
          <Form onSubmit={modif}>
          <div className='input-valid-button'>
            <select
            className='form-control'
            value={editMail}
            onChange={(e) =>setEditMail(e.target.value)}
            sx={{ margin: '20px'}}
            type='text'
          >
            <option value='Oui'>Oui</option>
            <option value='Non validé'>Non validé</option>
          </select>
          <button className='btn btn-primary' style={{marginLeft: '10px'}}>Valider</button>
          
          </div>
          </Form>
        </header>
        <label style={{ marginLeft: '20px' }}>{message}</label>
        <div className='tous-affichage-remboursement'>
          {
            donneRemboursementP.length > 0 && (
              donneRemboursementP.map((item, index) => (
                <div key={index} className='donnnees-afficher'>
                  <label>Nom passager : {item.nomPass}</label>
                  <label>Adresse mail : {item.mailAdresse}</label>
                  <label>Contact : {item.telephoneRemboursement}</label>
                  <label>Mode de remboursement : {item.modeRemboursement}</label>
                  <label>Justification : {item.pieceJustificative}</label>
                  <label>Date de demande : {item.dateDemandeRemboursement.split('T')[0]}</label>
                  <label>Validation: {item.verification}</label>
                  <div className='actions-buttons-remboursement'>
                    <AiFillEdit size={20} style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() =>edit(item.mailAdresse)}/>
                    <AiTwotoneDelete size={20} onClick={() => deleteRem(item.mailAdresse)} style={{ cursor: 'pointer' }} />
                  </div>
                </div>

              ))
            )
          }
        </div>
      </div>
      <Dialog
        open={open}
        disablePortal={true}
        sx={{marginTop: '-180px'}}
      >
        <DialogTitle className='text-danger'>Information</DialogTitle>
        <DialogContentText sx={{margin: '15px'}}>Vous êtes sûr <AiFillQuestionCircle size={40} /></DialogContentText>
        <DialogActions>
          <Button onClick={() => supprimerRemboursement(mailaka)}>Oui</Button>
          <Button onClick={() =>setOpenDialog(false)}>Non</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default RemboursementPassager