import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import './Avion.css'
import { Dialog, DialogActions, DialogContentText, DialogTitle, FormLabel, InputAdornment, TextField } from '@mui/material'
import Table from 'react-bootstrap/Table';
import * as AiIcons from '@mui/icons-material'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

function Avion() {
  const [donneAvion, setDonneAvion] = useState([]);
  const [rechercherInput, setRechercherInput] = useState("");
  const [numeroAvion, setNumeroAvion] = useState("");
  const [modelAvion, setModelAvion] = useState("");
  const [capacite, setCapacite] = useState("");
  const [messageAvion, setMessageAvion] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [a, setA] = useState("");
  const [afficherEditAvion, setAfficherEditAvion] = useState(false);
  const [editModel, setEditModel] = useState("");
  const [editCapacite, setEditCapacite] = useState("");
  const [IdEdit, setIdEdit] = useState("");
  const [messageEditAvion, setMessageEditAvion] = useState("");

  useEffect(() => {
    AfficherAvion();
    VerificationRechercheAvion();
  })

  const AfficherAvion = async () => {
    await axios.get(`http://localhost:5077/api/Avion`).then(({ data }) => (
      setDonneAvion(data)
    ))
  }

  const rechercherAvion = async () => {
    await axios.get(`http://localhost:5077/api/Avion/recherche-avion/${rechercherInput}`).then(({ data }) => (
      setDonneAvion(data)
    ))
  }
  const VerificationRechercheAvion = () => {
    if (rechercherInput === "") {
      AfficherAvion();
    } else {
      rechercherAvion();
    }
  }

  const ajoutAvion = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("numeroAvion", numeroAvion);
    formData.append("modelAvion", modelAvion);
    formData.append("capacite", capacite);
    if (numeroAvion === "" || modelAvion === "" || capacite === "") {
      setMessageAvion(<label className='text-danger'>Tous les champs sont obligatoires</label>);
      setTimeout(() => {
        setMessageAvion("");
      }, 10000);
    } else {
      try {
        await axios.post('http://localhost:5077/api/Avion/Ajout-avion', formData, { headers: { 'Content-Type': 'application/json' } }).then(({ data }) => {
          setMessageAvion(<label className='text-success'>{data}</label>)
          setTimeout(() => {
            setMessageAvion("");
          }, 10000);
        })
        AfficherAvion();
        setNumeroAvion("");
        setModelAvion("");
        setCapacite("");
      } catch (error) {
        throw (error);
      }
    }
  }
  const supprimerAvion = async (id) => {
    try {
      await axios.delete(`http://localhost:5077/api/Avion/suppression-avion/${id}`).then(({ data }) => {
        setMessageAvion(<label className='text-danger'>{data}</label>);
        setTimeout(() => {
          setMessageAvion("");
        }, 10000);
      })
      setOpenDialog(false)
      AfficherAvion();
    } catch (error) {
      throw (error)
    }
  }

  const ConfirmeSuppression = (x) => {
    setOpenDialog(true);
    setA(x)
  }

  const editAvion = async (id) => {
    setIdEdit(id)
    try {
      await axios.post(`http://localhost:5077/api/Avion/edit-avion/${id}`).then(({ data }) => {
        const resultat = [data]
        resultat.map(item =>{
          setEditModel(item.modelAvion);
          setEditCapacite(item.capacite)
        })
      })
    } catch (error) {
      throw (error)
    }
    setAfficherEditAvion(true)
  }

  const modifierAvion = async (e) =>{
    console.log("id edit : ", IdEdit);
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", IdEdit)
    formData.append("numeroAvion", "string")
    formData.append("modelAvion", editModel)
    formData.append("capacite", editCapacite)

    try {
        await axios.post(`http://localhost:5077/api/Avion/modification-avion/${IdEdit}`
        ,formData, {headers:{'Content-Type': 'application/json'}}
        ).then(({data}) =>{
          setMessageEditAvion(<label className='text-success' style={{fontSize: '1.2em'}}>{data}</label>)
        })
        AfficherAvion();
        setTimeout(() => {
          setAfficherEditAvion(false);
          setMessageEditAvion("");
        }, 7000);
    } catch (error) {
        throw(error)
    }
  }

  return (
    <div>
      <Menu />
      <div className='avions'>
        <div className='image-avion'>
          <div className='formulaire-edit'
            style={{
              marginTop: !afficherEditAvion ? '-100%' : '0%',
              transition: 'margin-top 1s', zIndex: !afficherEditAvion ? '-1' : '1'
            }}>
            <Form onSubmit={modifierAvion}>
            <div className='edit-input-avion text-center'>
              
              <div className='form-group'>
                <FormLabel className='text-primary' sx={{ margin: '6px' }}>Modèle d'un avion : </FormLabel>
                <TextField
                  type='text'
                  placeholder="saisir le model de l'avion"
                  value={editModel}
                  onChange={(e) =>setEditModel(e.target.value)}
                  size='small'
                />
              </div>
              <div className='form-group'>
                <FormLabel className='text-primary' sx={{ margin: '6px' }}>Capacité : </FormLabel>
                <TextField
                  type='number'
                  placeholder='saisir la capacité'
                  value={editCapacite}
                  onChange={(e) =>setEditCapacite(e.target.value)}
                  size='small'
                />
              </div><br></br><br></br>
              <div className='form-group boutton-edit-avion'>
                <button className='btn btn-primary'>ENREGISTRER</button>
                <button className='btn btn-danger' onClick={() => setAfficherEditAvion(false)}>QUITTER</button>
                <label>{messageEditAvion}</label>
              </div>
            </div>
            </Form>
          </div>
        </div>
        <div className='contenu-avion'>
          <div className='formulaires-avion mt-2'>
            <Form onSubmit={ajoutAvion}>
              <div className='form-group mt-2' style={{ margin: '10px' }}>
                <label style={{ margin: '6px' }} className='text-primary'>Numéro d'avion :</label>
                <TextField
                  type='text'
                  placeholder="Entrez le numéro de serie de l'avion"
                  value={numeroAvion}
                  onChange={(e) => setNumeroAvion(e.target.value)}
                  size='normal'
                />
              </div>
              <div className='form-group mt-2' style={{ margin: '10px' }}>
                <label style={{ margin: '6px' }} className='text-primary'>Modèle d'un avion :</label>
                <TextField
                  type='text'
                  placeholder="Entrez le modele de l'avion"
                  value={modelAvion}
                  onChange={(e) => setModelAvion(e.target.value)}
                  size='normal'
                  sx={{ width: 'auto' }}
                />
              </div>
              <div className='form-group mt-2' style={{ margin: '10px' }}>
                <label style={{ margin: '6px' }} className='text-primary'>Capacité de l'avion :</label>
                <TextField
                  type='number'
                  placeholder="Entrez la capacité"
                  value={capacite}
                  onChange={(e) => setCapacite(e.target.value)}
                  size='normal'
                  inputProps={{ min: 0 }}
                />
              </div>
              <div className='flex' style={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'space-between', margin: '15px'
              }}>
                <button className='btn btn-primary'>ENREGISTRER</button>
                <label style={{ margin: '10px' }}>{messageAvion}</label>
              </div>
            </Form>
          </div>

          <div className='tableau-avion'>
            <div style={{ boxShadow: '10px 0px 10px darkgray', marginBottom: '4px' }}>
              <TextField
                type='text'
                placeholder='rechercher...'
                value={rechercherInput}
                onChange={(e) => setRechercherInput(e.target.value)}
                size='small'
                sx={{ marginBottom: '6px', width: '100%' }}
                InputProps={
                  {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <AiIcons.SearchOutlined></AiIcons.SearchOutlined>
                      </InputAdornment>
                    )
                  }
                }
              />
            </div>
            <div className='affichage-avion'>
              <Table striped hover variant="darkgray" className='table '>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NUMERO D'AVION</th>
                    <th>MODELE DE L'AVION</th>
                    <th>CAPACITE</th>
                    <th>OPERATIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    donneAvion.length > 0 && (
                      donneAvion.map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.numeroAvion}</td>
                          <td>{item.modelAvion}</td>
                          <td>{item.capacite}</td>
                          <td style={{ width: '200px' }}>
                            <Link style={{ margin: '10px', textDecoration: 'none' }} onClick={() => editAvion(item.id)}>
                              <AiIcons.Edit color='blue'></AiIcons.Edit>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} onClick={() => ConfirmeSuppression(item.id)}>
                              <AiIcons.Delete style={{ color: 'red' }}></AiIcons.Delete>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )
                  }
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <Dialog
          open={openDialog}
          disablePortal={true}
          sx={styleDialog}
        >
          <DialogTitle className='text-danger'>Informations</DialogTitle>
          <DialogContentText sx={{ margin: '10px' }}>
            Voulez-vous supprimer
            <AiIcons.QuestionMark sx={{ fontSize: '3em' }}></AiIcons.QuestionMark>
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => supprimerAvion(a)} className='btn btn-secondary'>Ok</Button>
            <Button onClick={() => setOpenDialog(false)} className='btn btn-danger'>Annuler</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}
const styleDialog = {
  top: -150,
}
export default Avion