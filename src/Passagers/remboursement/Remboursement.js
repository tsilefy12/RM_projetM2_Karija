import React, { useState } from 'react'
import MenuPassager from '../MenuPassager/MenuPassager'
import '../remboursement/Remboursement.css'
import { TextField } from '@mui/material'
import axios from 'axios';
import { Form } from 'react-bootstrap';

function Remboursement() {
  const [nompass, setNomPass] = useState("");
  const [mailadresse, setMailAdresse] = useState("");
  const [piecejustificative, setPieaceJustificative] = useState("");
  const [telephoneremboursement, setTelephoneRemboursement] = useState("");
  const [dateremboursement, setDateRemboursement] = useState("");
  const [verification, setVerification] = useState("");
  const [modeRemboursement, setModeRemboursement] = useState("");
  const [erreurMessage, setErreurMessage] = useState("");

  const rembourser = async (e) =>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("mailAdresse", mailadresse);
    formData.append("nomPass", nompass);
    formData.append("modeRemboursement", modeRemboursement);
    formData.append("pieceJustificative", piecejustificative);
    formData.append("telephoneRemboursement", telephoneremboursement);
    formData.append("dateDemandeRemboursement", dateremboursement);
    formData.append("verification",verification);

    if (nompass === "" || mailadresse === "" || piecejustificative === "" || 
    telephoneremboursement === "" || dateremboursement === "") {
      const erreur = (<label className='text text-danger'>Les champs sont obligatoires.</label>);
      setErreurMessage(erreur);
    } else {
       await axios.post(`http://localhost:5077/api/Remboursement/demande-remboursement`, 
       formData,{headers :{'Content-Type': 'application/json'}}
       ).then(({data}) =>{
        const successMessage = (<label className='text text-success'>{data}</label>)
         setErreurMessage(successMessage);
       })
    }
  }
  return (
    <div className='flex remboursement'>
      <MenuPassager />
      <div className='remboursement-contenue'>
        <header className='text text-info' style={{ margin: '20px', fontSize: '1.5em' }}>
          DEMANDE DE REMBOURSEMENT
        </header>
       <Form onSubmit={rembourser}>
       <div className='flex-box'>
          <TextField
            type='text'
            placeholder='saisir votre adresse mail'
            value={mailadresse}
            onChange={(e) =>setMailAdresse(e.target.value)}
            sx={{ margin: '20px' }}
          />
          <TextField
            type='text'
            placeholder='nom passager'
            value={nompass}
            onChange={(e) =>setNomPass(e.target.value)}
            sx={{ margin: '20px' }}
          />
          <TextField
            type='text'
            placeholder='numéro téléphone'
            value={telephoneremboursement}
            onChange={(e) =>setTelephoneRemboursement(e.target.value)}
            sx={{ margin: '20px' }}
          />
          <TextField
            type='text'
            placeholder='mode de remboursement'
            value={modeRemboursement}
            onChange={(e) =>setModeRemboursement(e.target.value)}
            sx={{ margin: '20px' }}
          />
          <TextField
            type='text'
            placeholder='pièce justificative'
            value={piecejustificative}
            onChange={(e) =>setPieaceJustificative(e.target.value)}
            sx={{ margin: '20px' }}
          />
          {/* <TextField
            type='text'
            placeholder='Vérification'
            value={verification}
            onChange={(e) =>setVerification(e.target.value)}
            sx={{ margin: '20px' }}
          /> */}
          <TextField
            type='date'
            value={dateremboursement}
            onChange={(e) =>setDateRemboursement(e.target.value)}
            sx={{ margin: '20px' }}
            size='small'
          />
        </div>
        <div className='flex'>
          <button className='btn btn-info' style={{margin: '20px'}}>ENVOYER LA DEMANDE</button>
          <span style={{margin: '25px'}}>{erreurMessage}</span>
        </div>
       </Form>
        <div className='flex-column' style={{marginLeft: '20px', width: '95%'}}>
        <div className='flex-box'>
               <label>ID : </label>
               <span className='text text-info' style={{marginLeft: '6px'}}>1</span>
             </div>
             <div className='flex-box'>
               <label>Nom passager : </label>
               <span className='text text-info' style={{marginLeft: '6px'}}>2</span>
             </div>
             <div className='flex-box'>
               <label>Adresse mail : </label>
               <span className='text text-info' style={{marginLeft: '6px'}}>3</span>
             </div>
             <div className='felx-box'>
               <label>Téléphone : </label>
               <span className='text text-info' style={{marginLeft: '6px'}}>4</span>
             </div>
             <div className='felx-box'>
               <label>Date :</label>
               <span className='text text-info' style={{marginLeft: '6px'}}>5</span>
             </div>
             <div className='felx-box'>
               <label>Demande :</label>
               <span className='text text-info' style={{marginLeft: '6px'}}>6</span>
             </div>
             <div className='flex-box'>
               <label>Avix du responsable :</label>
               <span className='text text-info' style={{marginLeft: '6px'}}>7</span>
             </div>
        </div>
      </div>
    </div>
  )
}

export default Remboursement