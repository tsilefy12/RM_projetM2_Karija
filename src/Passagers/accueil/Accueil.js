import React from 'react'
import MenuPassager from '../MenuPassager/MenuPassager'
import { name } from '../Name'
import { useNavigate } from 'react-router'

function Accueil() {
  const navigate = useNavigate();
  return (
    <>
      {
        (name.length == 0) ? navigate('/') : (
          <div>
            <MenuPassager />
            <div>

            </div>
          </div>
        )
      }
    </>
  )
}

export default Accueil