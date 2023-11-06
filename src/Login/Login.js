import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import * as AiIcons from "react-icons/ai"
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import 'tachyons';
import axios from 'axios';
import { name } from '../Passagers/Name';
function Login() {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [motdepasse, setMotDePasse] = useState("");
  const [emailadresse, setEmailAdresse] = useState("");
  const [pwd, setPwd] = useState("");
  const [erreurMessage, setErreurMessage] = useState("");
  const [count, setCount] = useState(0);
  // const [donneLogin, setDonneLogin] = useState([]);
 
  const authentification = async () => {
    if (mail === "" || pwd === "") {
      const vide = (<label className='text-danger'>Veuillez saisir vos informations</label>);
      setErreurMessage(vide);
      setTimeout(() => {
        setErreurMessage("")
      }, 10000);
    } else {
      await axios.get(`http://localhost:5077/api/Passagers/login?mail=${mail}`).then(({ data }) => {
        console.log("data :", data);

        if (data.length == 0) {
          const invalid = (<label className='text-danger'>Votre adresse mail est incorrect</label>);
          setErreurMessage(invalid);
          setTimeout(() => {
             setErreurMessage("");
          }, 15000);
        } else {
          data.map((item) => {
            setMotDePasse(item.password);
            setEmailAdresse(item.email);
          })
        }
        if (mail == emailadresse && motdepasse == pwd) {
          name.push(emailadresse);
          const ok = (<div className='roule'>
           <label className='text-success'>Chargement encours...</label>
           <div className='load'></div>
           </div>);
          setErreurMessage(ok);
          setTimeout(() => {
           navigate('/MenuPassager')
           setErreurMessage("");
          }, 7000);
       } else {
         const mdpIncorrect = (<label className='text-danger'>Mot de passe incorrect</label>);
         setErreurMessage(mdpIncorrect);
       }
    })}
    }
   
  return (
    <div className='tous'>
      <div className='login-formulaire grow'>
        <TextField
          type='text'
          placeholder='email'
          className='login-input'
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          InputProps={
            {
              startAdornment: (
                <InputAdornment position='start'>
                  <AiIcons.AiFillMail></AiIcons.AiFillMail>
                </InputAdornment>
              )
            }
          }
        />
        <TextField
          type='password'
          placeholder='mot de passe'
          className='login-input'
          autoComplete='Off'
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AiIcons.AiFillLock></AiIcons.AiFillLock>
              </InputAdornment>
            )
          }}
        />
        <div className='button-login'>
          <button className='btn btn-success login-input' onClick={() => authentification(mail)}>Sign in</button>
          <Link to={'/inscription'} className='login-input'>S'inscrire</Link>
        </div>
        <span>{erreurMessage}</span>
      </div>
    </div>
  )

}
export default Login



