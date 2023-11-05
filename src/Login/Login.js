import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { FormLabel, Image } from 'react-bootstrap';
import * as AiIcons from "react-icons/ai"
import './Login.css';
import { Link } from 'react-router-dom';
import 'tachyons';
function Login() {

  return (
    <div className='tous'>
      <div className='login-formulaire grow'>
        <TextField
          type='text'
          placeholder='email'
          className='login-input'
          InputProps={
            {
              startAdornment:(
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
          InputProps={{
            startAdornment:(
              <InputAdornment position='start'>
                <AiIcons.AiFillLock></AiIcons.AiFillLock>
              </InputAdornment>
            )
          }}
        />
         <div className='button-login'>
         <button className='btn btn-success login-input'>Login</button>
         <Link to={'/inscription'} className='login-input'>S'inscrire</Link>
         </div>
      </div>
     
    </div>
  )
}
export default Login
