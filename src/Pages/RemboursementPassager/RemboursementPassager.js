import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import '../RemboursementPassager/RemboursementPassager.css'
import axios from 'axios';
import { TextField, InputAdornment, Dialog, DialogTitle, DialogContentText, DialogActions, Button } from '@mui/material';
import { AiFillEdit, AiFillQuestionCircle, AiOutlineSearch, AiTwotoneDelete } from 'react-icons/ai';

function RemboursementPassager() {
  const [donneRemboursementP, setDonneRembourseP] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpenDialog] = useState(false);
  const [mailaka, setMailaka] = useState("");

  useEffect(() => {
    verifier();
  })
  const affichageRemboursement = async () => {
    await axios.get(`http://localhost:5077/api/Remboursement`).then(({ data }) => {
      setDonneRembourseP(data);
    })
  }
  const rechercherRemboursement = async () => {
    await axios.get(`http://localhost:5077/api/Remboursement/recherche-remboursement/${recherche}`).then(({ data }) => {
      if (data == "Vous n'avez pas encore effectué la demande de remboursement.") {
        const msg = (<label className='text-danger'>{data}</label>);
        setMessage(msg);
      } else {
        setDonneRembourseP(data);
        const ok = (<label className='text-success'>Il y a {data.length} résultat trouvé</label>)
        setMessage(ok)
      }
    })
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
  return (
    <div className='remboursement-affichage'>
      <Menu />
      <div className='afficher-remboursement'>
        <header style={{ marginLeft: '20px' }}>
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
          <label style={{ marginLeft: '20px' }}>{message}</label>
        </header>
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
                    <AiFillEdit size={20} style={{ marginRight: '10px' }} />
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