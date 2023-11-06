import React, { useEffect, useState } from 'react'
import '../Page_Inscription/Inscription.css'
import { TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { Form, FormLabel, Image } from 'react-bootstrap';
function Inscription() {
  const [nompassager, setNomPassager] = useState("");
  const [adressepassager, setAdressePassager] = useState("");
  const [telephonepassager, setTelephonePassager] = useState("");
  const [emailPassager, setEmailPassager] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageMail, setMessageEmail] = useState("");
  const [messagePhone, setMessagePhone] = useState("");
  const [selectPays, setSelectPays] = useState("");

  useEffect(() => {
    validationEmail();
    verifyNumero();
  })
  const validationEmail = () => {
    const verifyEmail = /[a-zA-Z][a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
    const valider = verifyEmail.test(emailPassager);

    if (!valider) {
      const msg4 = (<label className='text text-danger'>Adresse mail non valide</label>);
      setMessageEmail(msg4);
    } else {
      const msg5 = (<label className='text text-success'></label>)
      setMessageEmail(msg5);
    }
  }
  const verifyNumero = () =>{
    const numtelephone = /^(038|034|032|033)\d{7}$/;
          const validerNumeTelephone = numtelephone.test(telephonepassager);
          if (selectPays =="Autres") {
            setMessagePhone("")
          }
          else if (!validerNumeTelephone) {
            const msg6 = (<label className='text text-danger'>Numéro du téléphone est invalide</label>);
            setMessagePhone(msg6);
          }
           else {
            const msg7 = (<label className='text-success'>Ok</label>);
            setMessagePhone(msg7);
          }
  }
  const inscriptionPassager = async (e) => {
    e.preventDefault();

    if (nompassager === "" || adressepassager === "" || telephonepassager === ""
      || emailPassager === "" || password === "" || selectPays === "Pays") {
      const msg = (<label className='text text-danger'>Veuillez renseigner tous les champs!</label>)
      setMessage(msg);
    } else {
      try {
        const verifyEmail = /[a-zA-Z][a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
        const valider = verifyEmail.test(emailPassager);
        if (!valider) {
          const msg4 = (<label className='text text-danger'>Adresse mail non valide</label>);
          setMessageEmail(msg4);
          setMessage(msg4);
        } else if (selectPays == "Madagascar") {
          const numtelephone = /^(038|034|032|033)\d{7}$/;
          const validerNumeTelephone = numtelephone.test(telephonepassager);
          if (!validerNumeTelephone) {
            const msg6 = (<label className='text text-danger'>Numéro du téléphone est invalide</label>);
            setMessagePhone(msg6);
            setMessage(msg6);
          } else {
            const msg7 = (<label className='text-success'>Ok</label>);
            setMessagePhone(msg7);
            response();
          }
        }
        else if (selectPays == "Autres") {
          setMessagePhone("");
          response();
        }
      } catch (error) {
        const msg3 = (<label className='text text-danger'>Une erreur s'est produite. Veuillez réessayer.</label>)
        setMessage();
      }
    }
  }
  const response = async () =>{
    const formData = new FormData();
    formData.append("nomPassager", nompassager);
    formData.append("adressepassager", adressepassager);
    formData.append("telephone", telephonepassager);
    formData.append("email", emailPassager);
    formData.append("password", password);
    await axios.post(`http://localhost:5077/api/Passagers/inscription-passagers`, formData, { headers: { 'Content-Type': 'application/json' } }).then(({data}) =>{
      const msg2 = (<label className='text-success'>{data}</label>)
      setMessage(msg2);
      setNomPassager("");
      setAdressePassager("");
      setTelephonePassager("");
      setEmailPassager("");
      setPassword("");
    })
           
  }
  return (
    <>
      <div className='flex-box inscription'>
        <div className='logo-inscription'>
        </div>
        <Form onSubmit={inscriptionPassager}>
          <div className='flex-box formulaire-inscription'>
            <header className='text text-white inscrit-header'>
              PAGE D'INSCRIPTION DU PASSAGER
            </header>
            <TextField
              type='text'
              placeholder='saisir votre nom'
              value={nompassager}
              onChange={(e) => setNomPassager(e.target.value)}
              sx={{ margin: '20px' }}
              variant='standard'
            />
            <TextField
              type='text'
              placeholder='saisir votre adresse email'
              value={emailPassager}
              onChange={(e) => setEmailPassager(e.target.value)}
              sx={{ margin: '20px' }}
              variant='standard'
              helperText={messageMail}
            />
            <TextField
              type='text'
              placeholder='saisir votre adresse'
              value={adressepassager}
              onChange={(e) => setAdressePassager(e.target.value)}
              sx={{ margin: '20px' }}
              variant='standard'
            />
            <div>
              <select style={{ marginTop: '20px', marginLeft: '20px', borderBottom: '1px solid gray', border: 'none' }}
                value={selectPays} onChange={(e) => setSelectPays(e.target.value)}
              >
                <option>Pays</option>
                <option>Madagascar</option>
                <option>Autres</option>
              </select>
              <TextField
                type='text'
                placeholder='saisir votre numéor téléphone'
                value={telephonepassager}
                onChange={(e) => setTelephonePassager(e.target.value)}
                sx={{ margin: '20px' }}
                variant='standard'
                helperText={messagePhone}
              />
            </div>
            <TextField
              type='text'
              placeholder='saisir votre mot de passe'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ margin: '20px' }}
              variant='standard'
            />
            <div className='flex-box'>
              <button className='btn btn-primary' style={{ margin: '20px' }}>S'INSCRIRE</button>
              <Link to={'/'} ><button className='btn btn-secondary'>Je suis déjà inscrit</button></Link>
              <span style={{ marginLeft: '20px' }}>{message}</span>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export default Inscription