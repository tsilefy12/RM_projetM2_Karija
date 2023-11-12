import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import './Dasboard.css'
import { Tooltip, Legend, Line, LineChart, XAxis, CartesianGrid, YAxis, PieChart, Pie } from 'recharts';
import axios from 'axios'
function Tableau() {
  const [donne, setDonne] = useState([]);
  const [actifPassager, setActifPassager] = useState([]);
  const [total, setTotal] = useState([]);
  const [damandeprevue, setDemmandeP] = useState([]);
  useEffect(() => {
    afficher();
    passgerActif();
    totalrevenue();
    demandePrevue();
  })
  const afficher = async () => {
    try {
      const response = await fetch('http://localhost:5077/api/Calcule');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDonne(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }
  const passgerActif = async () => {
    await axios.get(`http://localhost:5077/api/Actif/tous-actifs`).then(({ data }) => {
      setActifPassager(data);
    })
  }
  const totalrevenue = async () => {
    await axios.get(`http://localhost:5077/api/Calcule/total-revenu`).then(({ data }) => {
      setTotal(data);
    })
  }
  const demandePrevue = async () => {
    await axios.get(`http://localhost:5077/api/DemandePrevue`).then(({ data }) => {
      setDemmandeP(data);
    })
  }
  return (
    <div className='dasboard'>
      <Menu />
      <div className='chart'>
        <header className='header-chart'>
          <h1 className='contenue-titre-chart'>DASHBOARD</h1>
        </header>
        <div className='donne-charts'>

          <div className="card passager-actif bg-info grow">
            <div className="card-body passager-actif-body">
              <p style={{ fontSize: '1.3em', fontFamily: 'Times new roman' }}>UTILISATEURS ACTIF.</p>
              <span style={{ fontSize: '2em', fontFamily: 'Times new roman' }}>{actifPassager.length}</span>
            </div>
          </div>

          <div className="card passager-actif bg-red grow">
            <div className="card-body passager-actif-body">
              <p style={{ fontSize: '1.3em', fontFamily: 'Times new roman' }}>TOTAL DES REVENUES</p>
              {
                total.length > 0 && (
                  total.map((t) => (
                    <span style={{ fontSize: '2em', fontFamily: 'Times new roman' }}>{t.tarif} Ariary</span>
                  ))
                )
              }
            </div>
          </div>

          <div className="card passager-actif bg-success grow">
            <div className="card-body passager-actif-body">
              <p style={{ fontSize: '1.3em', fontFamily: 'Times new roman' }}>DEMANDE PREVUE.</p>
              <span style={{ fontSize: '1.3em', fontFamily: 'Times new roman' }}>{damandeprevue.length}</span>
            </div>
          </div>
          <div className='line-charts'>
            <PieChart width={400} height={400}>
              <Pie data={donne} dataKey="NombrePassager" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="gray" />
              <Pie data={donne} dataKey="Tarif" nameKey="name" cx="50%" cy="50%" innerRadius={90} outerRadius={120} fill="#800000" />
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Tableau