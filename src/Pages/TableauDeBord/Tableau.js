import React from 'react'
import Menu from '../../Menu/Menu'
import './Dasboard.css'

function Tableau() {
  return (
    <div className='dasboard'>
        <Menu/>
        <div className='chart'>
         <header className='header-chart'>
          <h1 className='contenue-titre-chart'>Titre</h1>
         </header>
        </div>
      </div>
  )
}

export default Tableau