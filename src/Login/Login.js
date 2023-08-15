import React from 'react';
import { FormLabel, TextField } from '@mui/material';
import { Button, Image } from 'react-bootstrap';
import logo from '../images/images.jpg';
import './Login.css';
import { Link } from 'react-router-dom';
import 'tachyons';
function Login() {
  return (
    <div className='container'>
      <div className='tous'>
        <div className='logo'>
          <Image src={logo} id='img' sizes='sx'></Image>
        </div>
        <div className='login'>
          <FormLabel className='text text-light' id='label'>Login</FormLabel>
          <div className='form-group'>
            <div>
              <TextField
                id="standard-basic"
                label="Adresse mail"
                variant="standard"
                fullWidth
                size='small'
                sx={{ input: { color: 'white' }, label: { color: 'white' }, variant: { color: 'white'} }}
              />
            </div>
            <div id='pswd'>
              <TextField
                label="Mot de passe"
                variant="standard"
                outline="white"
                fullWidth
                size='small'
                type='password'
                sx={{ input: { color: 'white' }, label: { color: 'white' }, outline: { color: 'white' } }}
                autoComplete='off'
              />
            </div>
            <div className='action'>
              <Button className='btn btn-grey grow' 
              style={{ backgroundColor: 'grey', color: 'white', border: 'none' }}>Sign in</Button>
              <Link to={'/inscription'} style={{ textDecoration: 'none', fontSize: '1.2em', float: 'right', color: 'white' }}>create account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login