import React from 'react';
import {  TextField,InputAdornment } from '@mui/material';
import { FormLabel, Image } from 'react-bootstrap';
import * as AiIcons from "react-icons/ai"
import logo from '../images/FILE023.JPG';
import './Login.css';
import { Link } from 'react-router-dom';
import 'tachyons';
function Login() {
  
  return (
    <div className='tous'>
      <div className='logo'>
        <Image src={logo} id='img' width={320} height={308}></Image>
      </div>
      <div className='flex login'>
       <div className='flex' id='inpt'>
       <FormLabel style={{margin: '20px'}} id='labelLog'>Adresse mail :</FormLabel>
        <TextField
          type='text'
          sx={{ marginTop: '20px', label: { marginTop: '-10px', width: 'auto' } }} id='inputLog'
          autoComplete='off'
          placeholder='saisir votre adresse mail'
          InputProps={
            {
              startAdornment: (
                <InputAdornment position="start">
                  <AiIcons.AiFillMail width={20} height={20} color='#800000'/>
                </InputAdornment>
              ),
            }
          }
        />
       </div>
      <div className='flex' id='inpt'>
      <FormLabel style={{margin: '20px'}} id='labelLog'>Mot de passe :</FormLabel>
      <TextField
          type='password'
          sx={{ marginTop: '20px', label: { marginTop: '-10px' } }} id='inputLog'
          autoComplete='off'
          placeholder='saisir votre mot de passe'
          InputProps={
            {
              startAdornment: (
                <InputAdornment position="start">
                  <AiIcons.AiTwotoneLock  width={20} height={20} color='#800000'/>
                </InputAdornment>
              ),
            }
          }
        />
      </div>
        <div className='bouton-login'>
          <button className='btn btn-info grow' id='boutonLog'>Sign in</button>
          <Link to={'/inscription'} className='btn btn-success grow' id='boutonLog'>
            <button style={{ border: 'none' }} className='bg-success'>S'inscrire</button></Link>
        </div>
      </div>
    </div>
  )
}
export default Login
