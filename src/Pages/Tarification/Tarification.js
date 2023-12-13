import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import './Tarif.css'
import { FormGroup, FormLabel, TextField } from '@mui/material'
import axios from 'axios'

function Tarification() {
  const [donneTarif, setDonneTarif] = useState([]);

  useEffect(() => {
    afficherTarif();
  });

  const afficherTarif = async () => {
    await axios.get('http://localhost:5077/api/Tarif').then(({ data }) => {
      setDonneTarif(data);
    })
  }
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
        <button className='btn btn-primary' style={{ margin: '10px' }}>ENREGISTRER</button>
        <button className='btn btn-danger' style={{ margin: '10px' }}>REJETER</button>
      </div>
      <hr></hr>

      <div className='liste-tous'>
        {
          donneTarif.length > 0 && (
            donneTarif.map((element, i) => (
              <div className='liste-tarif' key={i}>
                <label>{element.id}</label>
              </div>
              
            ))
          )
        }
        {
          donneTarif.length > 0 && (
            donneTarif.map((element, i) => (
              <div className='liste-tarif' key={i}>
                <label>{element.id}</label>
              </div>
              
            ))
          )
        }
        {
          donneTarif.length > 0 && (
            donneTarif.map((element, i) => (
              <div className='liste-tarif' key={i}>
                <label>{element.id}</label>
              </div>
              
            ))
          )
        }
        {
          donneTarif.length > 0 && (
            donneTarif.map((element, i) => (
              <div className='liste-tarif' key={i}>
                <label>{element.id}</label>
              </div>
              
            ))
          )
        }
      </div>

    </div>
  )
}
export default Tarification