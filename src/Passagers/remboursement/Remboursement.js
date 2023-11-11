import React, { useEffect, useState } from 'react'
import MenuPassager from '../MenuPassager/MenuPassager'
import '../remboursement/Remboursement.css'
import { TextField } from '@mui/material'
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { name } from '../Name';
import { useNavigate } from 'react-router';

function Remboursement() {
  const navigate =useNavigate();
  const [nompass, setNomPass] = useState("");
  const [mailadresse, setMailAdresse] = useState("");
  const [piecejustificative, setPieaceJustificative] = useState("");
  const [telephoneremboursement, setTelephoneRemboursement] = useState("");
  const [dateremboursement, setDateRemboursement] = useState("");
  const [verification, setVerification] = useState("");
  const [modeRemboursement, setModeRemboursement] = useState("");
  const [erreurMessage, setErreurMessage] = useState("");
  const [textVerification, setText] = useState("");
  const [donneRemboursement, setDonneRemborsement] = useState([]);

  useEffect(() => {
    tester(textVerification);
    afficher(textVerification);
  })
  const rembourser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("mailAdresse", mailadresse);
    formData.append("nomPass", nompass);
    formData.append("modeRemboursement", modeRemboursement);
    formData.append("pieceJustificative", piecejustificative);
    formData.append("telephoneRemboursement", telephoneremboursement);
    formData.append("dateDemandeRemboursement", dateremboursement);
    formData.append("verification", verification);
    await axios.post(`http://localhost:5077/api/Remboursement/demande-remboursement`,
      formData, { headers: { 'Content-Type': 'application/json' } }
    ).then(({ data }) => {
      const successMessage = (<label className='text text-success'>{data}</label>)
      setErreurMessage(successMessage);
    })
    setText("")
    setNomPass("")
    setTelephoneRemboursement("")
    setMailAdresse("")
    setModeRemboursement("")
    setPieaceJustificative("")
    setDateRemboursement("")
  }

  const tester = async (text) => {
    setMailAdresse(textVerification)
    if (textVerification == "") {
      const messageVide = (<label className='text-danger'>Veuilez remplir le champ adresse mail</label>);
      setErreurMessage(messageVide);
      setNomPass("")
      setTelephoneRemboursement("")
      setMailAdresse("")
      setModeRemboursement("")
      setPieaceJustificative("")
      setDateRemboursement("")
    }
    else {
      await axios.get(`http://localhost:5077/api/Remboursement/verifier-information/${textVerification}`).then(({ data }) => {
        if (data == 0 && text != "") {
          const messageNontrouve = (<label className='text-danger'>Vous n'avaz pas encore demandé l'annulation de votre voyage</label>);
          setErreurMessage(messageNontrouve);
          setNomPass("")
          setTelephoneRemboursement("")
          setMailAdresse("")
          setModeRemboursement("")
          setPieaceJustificative("")
          setDateRemboursement("")
        } else {
          if (dateremboursement == "") {
            const erreur = (<label className='text text-danger'>Le champ date est obligatoire.</label>);
            setErreurMessage(erreur);
          } else {
            const trouve = (<label className='text-primary'>Vous pouvez demander votre remboursement</label>);
            setErreurMessage(trouve);
            data.map((e) => {
              const nom = e.passager.nomPassager
              const phone = e.passager.telephone
              const modePaiye = e.annulation.methodePaiement
              const piece = e.annulation.valide
              setNomPass(nom)
              setTelephoneRemboursement(phone)
              setModeRemboursement(modePaiye)
              setPieaceJustificative(piece)
            })

          }
        }
      })
    }
  }

  const afficher = async (valeur) => {
    if (valeur =="") {
   
    } else {
      await axios.get(`http://localhost:5077/api/Remboursement/recherche-remboursement/${valeur}`).then(({ data }) => {
      if (data == "Vous n'avez pas encore effectué la demande de remboursement.") {

      } else {
        setDonneRemborsement(data);
      }
    })
    }
  }
  return (
    <>
      {
         (name.length == 0) ? navigate('/') : (
          <div className='flex remboursement'>
      <MenuPassager />
      <div className='remboursement-contenue'>
        <header className='text text-success' style={{ marginLeft: '20px', fontSize: '1.5em' }}>
          DEMANDE DE REMBOURSEMENT 
        </header>
        <Form onSubmit={rembourser}>
          <div className='flex-box'>
            <TextField
              type='text'
              placeholder='saisir votre adresse mail'
              value={textVerification}
              onChange={(e) => setText(e.target.value)}
              sx={{ margin: '20px' }}
            />
            <TextField
              type='text'
              placeholder='nom passager'
              value={nompass}
              onChange={(e) => setNomPass(e.target.value)}
              sx={{ margin: '20px' }}
            />
            <TextField
              type='text'
              placeholder='numéro téléphone'
              value={telephoneremboursement}
              onChange={(e) => setTelephoneRemboursement(e.target.value)}
              sx={{ margin: '20px' }}
            />
            <TextField
              type='text'
              placeholder='mode de remboursement'
              value={modeRemboursement}
              onChange={(e) => setModeRemboursement(e.target.value)}
              sx={{ margin: '20px' }}
            />
            <TextField
              type='text'
              placeholder='pièce justificative'
              value={piecejustificative}
              onChange={(e) => setPieaceJustificative(e.target.value)}
              sx={{ margin: '20px' }}
            />
            <TextField
              type='date'
              value={dateremboursement}
              onChange={(e) => setDateRemboursement(e.target.value)}
              sx={{ margin: '20px' }}
              size='small'
            />
          </div>
          <div className='flex-wrap'>
            <button className='btn btn-success' style={{ margin: '20px' }}>ENVOYER LA DEMANDE</button>
            <span style={{ margin: '25px' }}>{erreurMessage}</span>
          </div>
        </Form>
        <div className='flex-column' style={{ marginLeft: '20px', width: '95%' }}>
          <div className='card rembousementPassager'>
            <div className='card-header bg-success'>
              <TextField
                type='date'
                size='small'
                sx={{ marginLeft: '80%' }}
              />
            </div>
            <div className='card-body'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Adresse mail</th>
                    <th>Téléphone</th>
                    <th>Mode de remboursement</th>
                    <th>Justification</th>
                    <th>Date</th>
                    <th>Avix du responsable</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    donneRemboursement.length > 0 && (
                      donneRemboursement.map((item, index) => (
                        <tr key={index}>
                          <td>{item.nomPass}</td>
                          <td>{item.mailAdresse}</td>
                          <td>{item.telephoneRemboursement}</td>
                          <td>{item.modeRemboursement}</td>
                          <td>{item.pieceJustificative}</td>
                          <td>{item.dateDemandeRemboursement.split('T')[0]}</td>
                          <td style={{color: (item.verification=="Non validé")? 'red':'green'}}>{item.verification}</td>
                        </tr>
                      ))
                    )
                  }
                </tbody>
                <tfoot>
                  {
                    donneRemboursement.length == 0 &&(
                      <tr>
                      <td colspan={7} style={{textAlign: 'center', color: 'red'}}>Données indisponibles</td>
                      </tr>
                    )
                  }
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
         )
      }
    </>
  )
}

export default Remboursement