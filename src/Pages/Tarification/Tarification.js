import React from 'react'
import Menu from '../../Menu/Menu'
import './Tarif.css'
import { FormGroup, FormLabel, TextField } from '@mui/material'

function Tarification() {
  return (
    <div>
      <Menu />
      <div className='tarifs text-center'>
        <div className='flex-wrap formulaire-tarif-ajout'>
          <FormGroup className='input-tarif'>
            <FormLabel>Text</FormLabel>
            <TextField
              type='text'
              placeholder=''
              size='normal'
              className='input-tarif'
            />
          </FormGroup>
          <FormGroup className='input-tarif'>
            <FormLabel>Text</FormLabel>
            <TextField
              type='text'
              placeholder=''
              size='normal'
              className='input-tarif'
            />
          </FormGroup>
          <FormGroup className='input-tarif'>
            <FormLabel>Text</FormLabel>
            <TextField
              type='text'
              placeholder=''
              size='normal'
              
            />
          </FormGroup>
          <FormGroup className='input-tarif'>
            <FormLabel>Text</FormLabel>
            <TextField
              type='text'
              placeholder=''
              size='normal'
            />
          </FormGroup>
        </div>
      </div>
      <div className='flex boutton-tarif'>
        <button className='btn btn-primary' style={{margin: '10px'}}>ENREGISTRER</button>
        <button className='btn btn-danger' style={{margin: '10px'}}>REJETER</button>
      </div>
      <hr></hr>
    </div>
  )
}

export default Tarification