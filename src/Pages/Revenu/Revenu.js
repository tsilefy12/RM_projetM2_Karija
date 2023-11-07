import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import '../Revenu/Revenu.css'
import { InputAdornment, TextField } from '@mui/material'
import * as AiIcons from "react-icons/ai"
import axios from 'axios'

function Revenu() {
  const [donneRevenue, setDonneRevenue] = useState([]);
  const [TotalRevenues, setTotalRevenue] = useState([]);
  const [NombreT, setNombreT] = useState([]);
  const [inputRecherche, setInputRecherche] = useState("");

  useEffect(() => {
    verifier();
    totalRevenue();
    nombreTotal();
  })
  const afficherRevenue = async () => {
    await axios.get(`http://localhost:5077/api/Calcule`).then(({ data }) => {
      setDonneRevenue(data);
    })
  }
 const totalRevenue = async () =>{
  await axios.get(`http://localhost:5077/api/Calcule/total-revenu`).then(({data}) =>{
    if (data == 0) {
      setDonneRevenue(data);
    } else {
      setTotalRevenue(data);
    }
  })
 }
 const rechercheRevenue = async () =>{
  await axios.get(`http://localhost:5077/api/Calcule/rechercher?numerovol=${inputRecherche}`).then(({data}) =>{
      setDonneRevenue(data);
  })
 }
 const verifier = () =>{
  if (inputRecherche=="") {
    afficherRevenue();
  } else {
    rechercheRevenue();
  }
 }
 const nombreTotal = async () =>{
  await axios.get(`http://localhost:5077/api/Calcule/Nombre-vol`).then(({data}) =>{
  setNombreT(data)
  })
 }
  return (
    <div className='revenu'>
      <Menu />
      {/* <header className='revenu-header'>
            <h className='contenue-header-revenue'>Liste de revenus</h>
        </header> */}
      <div className='affciher-revenu'>
        <header className='titre-revenue text-center'>
          <h1>
            TABLEAU RECAPUTILATIF DE REVENU MANAGEMENT DE LA COMPAGNIE AERIENNE
            <hr style={{ width: '50%', marginLeft: '25%' }}></hr>
          </h1>
        </header>
      </div>
      <div className='tableau-revenu'>
        <div className='affiher-tableau-revenu'>
          <div className='flex-wrap'>
            {
              NombreT.length > 0 &&(
                NombreT.map((n, k) =>(
                  <span style={{ float: 'left',fontSize: '1.3em' }} key={k}>Nombre total de vol : {n.nombrePassager}</span>
                ))
              )
            }
            <TextField
              type='text'
              placeholder='rechercher vol...'
              value={inputRecherche}
              onChange={(e) =>setInputRecherche(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <AiIcons.AiOutlineSearch></AiIcons.AiOutlineSearch>
                  </InputAdornment>
                )
              }}
              sx={{ float: 'right', width: '400px', marginBottom: '10px' }}
            />
          </div>
          <table className='table'>
            <thead>
              <tr>
                <th>VOL</th>
                <th>DATE DEPART</th>
                <th>HEURE DEPART</th>
                <th>CAPACITE MAX</th>
                <th>NOMBRE DE PASSAGE</th>
                <th>REVENU TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {
                donneRevenue.length > 0 && (
                  donneRevenue.map((item, index) => (
                    <tr key={index}>
                      <td>{item.numerovol}</td>
                      <td>{item.datedepart.split('T')[0]}</td>
                      <td>{item.heuredepart}</td>
                      <td>{item.capacitemax}</td>
                      <td>{item.NombrePassager}</td>
                      <td>{item.Tarif} Ar</td>
                    </tr>
                  ))
                )
              }
            </tbody>
          </table>
        </div>
        <div className='total-revenue'>
          {
            TotalRevenues.length > 0 &&(
              TotalRevenues.map((t, i) =>(
                <label key={i} style={{fontSize: '1.5em'}}>TOTAL DE REVENU : {t.tarif} Ar</label>
              ))
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Revenu