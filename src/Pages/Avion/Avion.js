import { FormLabel,Icon,InputAdornment,TextField } from '@mui/material'
import React from 'react'
import '../Avion/Avion.css'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import * as AiIcons from "react-icons/ai"

function Avion() {
  return (
    <>
      <div className='avion'>
        <div>
          <header className='header'>
            <h1 className='text text-info' style={{ margin: '5.5%' }}>GESTION D'AVION</h1>
          </header>
        </div>
        <div className='containere'>
          <div className='form-group'>
            <div className='TextField'>
              <TextField
                label="Entrez le numéro d'avion"
                type='text'
                sx={{ input: { fontSize: '1.8em' }, label: { color: 'darkgrey' } }}
              />
            </div>
            <div className='TextField'>
              <TextField
                label="Entrer le modèle"
                type='text'
                sx={{ input: { fontSize: '1.8em' }, label: { color: 'darkgrey' } }}
              />
            </div>
            <div className='TextField'>
              <TextField
                label="Capacité"
                type='number'
                inputProps={{ min: 0 }}
                sx={{ input: { fontSize: '1.8em', width: '150px' }, label: { color: 'darkgrey' } }}
              />
            </div>
            <div className='TextField'>
              <Button className='btn btn-success grow'>
                ENREGISTRER
              </Button>
            </div>
          </div>
          <div className='card'>
            <div className='card-header'>
              <div className='liste-avion'>
                <FormLabel className='liste text-info'>
                  Liste des avions
                </FormLabel></div>
              <div className='recherche-avion'>
                <TextField
                  label="Rechercher"
                  type='text'
                  placeholder='rechercher....'
                  sx={{ input: { fontSize: '1.2em', width: '200px' }, label: { color: 'darkgrey' } }}
                  InputProps={{startAdornment:(
                    <InputAdornment position='start'>
                      <AiIcons.AiOutlineSearch></AiIcons.AiOutlineSearch>
                    </InputAdornment>
                  )}}
                /></div>
            </div>
            <div className='card-body'>
              <div className='tableau-avion'>
                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NUMERO AVION</th>
                      <th>MODE DE L'AVION</th>
                      <th>CAPACITE</th>
                      <th>OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td className='num-avion'>dfgd dfghfjggkh</td>
                      <td className='model-avion'>dfgdg ertrtyryr</td>
                      <td className='capacite-avion'>dfgfdg</td>
                      <td className='operations-btn'>
                        <Link ><AiIcons.AiFillEdit style={{ width: '20px', height: '20px' }}>
                        </AiIcons.AiFillEdit>
                        </Link>
                        <button style={{ border: 'none', background: 'none' }}>
                          <AiIcons.AiFillDelete style={{ color: 'red' }}>
                          </AiIcons.AiFillDelete>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td className='num-avion'>dfgd dfghfjggkh</td>
                      <td className='model-avion'>dfgdg ertrtyr</td>
                      <td className='capacite-avion'>dfgfdg</td>
                      <td className='operations-btn'>
                        <Link ><AiIcons.AiFillEdit style={{ width: '20px', height: '20px' }}>
                        </AiIcons.AiFillEdit>
                        </Link>
                        <button style={{ border: 'none', background: 'none' }}>
                          <AiIcons.AiFillDelete style={{ color: 'red' }}>
                          </AiIcons.AiFillDelete>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style={{maxWidth : '60px'}}>1000</td>
                      <td className='num-avion'>dfgd dfghfjggkh</td>
                      <td className='model-avion'>dfgdg ertrt</td>
                      <td className='capacite-avion'>dfgfdg</td>
                      <td className='operations-btn'>
                        <Link ><AiIcons.AiFillEdit style={{ width: '20px', height: '20px' }}>
                        </AiIcons.AiFillEdit>
                        </Link>
                        <button style={{ border: 'none', background: 'none' }}>
                          <AiIcons.AiFillDelete style={{ color: 'red' }}>
                          </AiIcons.AiFillDelete>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className='card-footer text-center'>
              <footer style={{ fontSize: '1.2em' }}>
              Il y a 1000 avions enrégistrés dans la base de données des compagnies aériennes 
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Avion