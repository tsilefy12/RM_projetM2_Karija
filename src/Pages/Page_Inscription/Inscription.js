import React from 'react'
import '../Page_Inscription/Inscription.css'
import { Link, TextField } from '@mui/material'
import { Button } from 'react-bootstrap'
function Inscription() {
  return (
    <>    
    <div className='tousInscription'>
      <div className='inscription'>

        <div className='container'>
          <header className='header'>
            <h1 className='text-info'>PAGE D'INSCRIPTION</h1>
          </header>
          <div className='inscription-formulaires'>

            <div className='form-group'>
              <TextField
                label="Saisir votre nom"
                fullWidth
                type='text'
                autoComplete='off'
                sx={{ input: { color: 'black', fontSize: '2em' }, label: { color: 'grey' }, variant: { color: 'black' } }}
              />
            </div>

            <div className='form-group'>
              <TextField
                label="Entrer l'adresse mail"
                fullWidth
                type='email'
                autoComplete='off'
                sx={{ input: { color: 'black', fontSize: '2em' }, label: { color: 'grey' }, variant: { color: 'black' } }}
              />
            </div>

            <div className='form-group'>
              <TextField
                label="Entrer mot de passe"
                fullWidth
                type='text'
                autoComplete='off'
                sx={{ input: { color: 'black', fontSize: '2em' }, label: { color: 'grey' }, variant: { color: 'black' } }}
              />
            </div>

            <div className='form-group'>
              <TextField
                label="Confirmer votre mot de passe"
                fullWidth
                type='text'
                autoComplete='Off'
                sx={{ input: { color: 'black', fontSize: '2em' }, label: { color: 'grey' }, variant: { color: 'black' } }}
              />
            </div>
            <div className='footer'>
               <Button className='btn btn-success grow' style={{float: 'left'}}>ENREGISTRER LES INFORMATIONS</Button>
            </div>
            <div className='footer'>
               <a href='/' className='btn btn-danger grow' style={{textDecoration: 'none'}}>J'AI DEJA INSCRIT</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Inscription