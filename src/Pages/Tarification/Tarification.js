import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import img from '../Tarification/ajouter.png'
import '../Tarification/Tarif.css'
import { Form } from 'react-bootstrap'
import { TextField, InputAdornment } from '@mui/material'
import * as AiIcons from "react-icons/ai"
import { Link} from 'react-router-dom'
import axios from 'axios'

function Tarification() {
  const [afficheFormulaire, setAfficheFormulaire] = useState(false);
  const [afficherFormulaireEdit, setAfficheFormulaireEdit] = useState(false);
  const [donneetarif, setDonneeTarif] = useState([]);
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [nombrePlaceDispoTarif, setNombrePlace] = useState("")
  const [typeTarif, setTypeTarif] = useState("");
  const [statut, setStatut] = useState("");

  const [IdEditTarif, setIdEditTarif] = useState("");
  const [editPrix, setEditPrix] = useState("");
  const [editNombrePlace, setEditNombrePlace] = useState("");
  const [editStatut, setEditStatut] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTypeTarif, setEditTypeTarif] = useState("string");
  const [rechercheTarif, setRechercheTarif] = useState("");

  useEffect(() => {
    AffichageTarification();
  })
  const AfficherTarif = async () => {
    await axios.get(`http://localhost:5077/api/Tarif`).then(({ data }) => {
      setDonneeTarif(data)
    })
  }
  const AjouterTarif = async (e) =>{
    e.preventDefault();
    await axios.post(`http://localhost:5077/api/Tarif/ajout-tarif`,
    {description, prix, typeTarif, nombrePlaceDispoTarif, statut},
    {headers:{'Content-Type': 'application/json'}}
    ).then(({data}) =>{
      console.log("message :", data)
    })
    setDescription("");
    setPrix("");
    setTypeTarif("");
    setNombrePlace("");
    setStatut("");
    AfficherTarif();
  }
  const supprimerTarif = async (id) => {
    await axios.delete(`http://localhost:5077/api/Tarif/supprimer-tarif/${id}`).then(({ data }) => {
      console.log(data)
    })
    AfficherTarif();
  }
  const Afficher = () => {
    setAfficheFormulaire(!afficheFormulaire)
  }
 
  const RechercherTarif = async () =>{
    await axios.post(`http://localhost:5077/api/Tarif/recherche-tarif?search=${rechercheTarif}`).then(({data}) =>{
      setDonneeTarif(data);
    })
  } 

  const AffichageTarification = () =>{
    if (rechercheTarif === "") {
      AfficherTarif();
    }else{
      RechercherTarif();
    }
  }
  const editeTarif = async (edit) => {
    await axios.post(`http://localhost:5077/api/Tarif/edit-tarif?Id=${edit}`).then(({ data }) => {
      data.map((itm) => {
        setEditPrix(itm.prix)
        setEditNombrePlace(itm.nombrePlaceDispoTarif)
        setEditStatut(itm.statut);
        setEditDescription(itm.description)
      })
    })
    setIdEditTarif(edit);
    AfficherEdit();
  }

  const ModifierTarif =async (e) =>{
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", editDescription);
    formData.append("prix", editPrix);
    formData.append("typeTarif", editTypeTarif)
    formData.append("nombrePlaceDispoTarif", editNombrePlace);
    formData.append("statut", editStatut);
    
    await axios.post(`http://localhost:5077/api/Tarif/modification-tarif?Id=${IdEditTarif}`, 
    formData, {headers: {
      'Content-Type': 'application/json'
    }}).then(({data}) =>{
      console.log("message :", data)
    })
    AfficherTarif();
    AfficherEdit(afficherFormulaireEdit);
  }
  const show = afficheFormulaire ? '20vh' : '0vh';
  const miseho = afficheFormulaire ? 'block' : 'none';
  const margetoptarif = !afficheFormulaire ? '5%' : '13%';
  const overflow = afficheFormulaire ? 'auto' : 'auto';
  const AfficherEdit = () => {
    setAfficheFormulaireEdit(!afficherFormulaireEdit);
  }


  return (
    <div>
      <Menu />
      <div className='tarif' style={{ height: !afficheFormulaire ? '100%' : '100%' }}>
        <div className='header-tarif'>
          <header className='text-info'>
            GERER LA TARIFICATION
            <div>
              <TextField className='form-control' style={{ width: "90%" }} placeholder='rechercher...'
                value={rechercheTarif} onChange={(e) =>setRechercheTarif(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='start'>
                      <AiIcons.AiOutlineSearch></AiIcons.AiOutlineSearch>
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </header>
        </div>
        <div className='tarif-corps'>
          <div className='formulaire-tarif' style={{
            height: show, transition: 'height 0.5s',
            border: !afficheFormulaire ? 'none' : ''
          }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img src={img} width={40} height={40} onClick={() => Afficher()} className='image-tarif'
                style={{ display: afficherFormulaireEdit ? 'none' : 'block' }}>
              </img><span style={{
                cursor: 'pointer', fontSize: '1.3em', zIndex: 1,
                display: afficherFormulaireEdit ? 'none' : 'block'
              }} className='text-primary nouvel-tarif' onClick={() => Afficher()}>
                Nouvel Tarif</span>
            </div>
           <Form onSubmit={ModifierTarif}>
           <span className='edit-tarif' style={{
                marginLeft: afficherFormulaireEdit ? '0px' : '-200%',
                transition: 'margin-left 0.5s'
              }}>
                <TextField label="Prix" type='number' value={editPrix} onChange={(e) => setEditPrix(e.target.value)} className='input'/>
                <TextField label="Nombre de place" value={editNombrePlace} onChange={(e) => setEditNombrePlace(e.target.value)} className='input'/>
                <TextField label="Statut" value={editStatut} onChange={(e) => setEditStatut(e.target.value)} className='input'/>
                <TextField label="Déscription" value={editDescription} onChange={(e) =>setEditDescription(e.target.value)} className='input'/>
                <button className='btn bg-secondary grow'>SAUVEGARDER</button>
              </span>
           </Form>
            <div style={{
              display: miseho, transition: 'opacity 0.5s',
              opacity: afficheFormulaire ? 1 : 0
            }} className='form-tarif'>
             <Form onSubmit={AjouterTarif}>
             <div className='form-tarif-1'>
                <TextField
                  type='text'
                  value={description}
                  onChange={(e) =>setDescription(e.target.value)}
                  multiline
                  rows={3}
                  placeholder='Déscription du siège, exemple: place réserver pour adultes'
                  autoComplete='off'
                  className='ajout-input'
                />
                <TextField
                  type='number'
                  value={prix}
                  onChange={(e) =>setPrix(e.target.value)}
                  placeholder='prix du siège'
                  autoComplete='off'
                  inputProps={{ min: 0 }}
                  className='ajout-input'
                />
                <TextField
                  type='text'
                  value={typeTarif}
                  onChange={(e) =>setTypeTarif(e.target.value)}
                  placeholder='type du tarif'
                  className='ajout-input'
                />
              </div>
              <div className='form-tarif-2'>
                <TextField
                  type='number'
                  value={nombrePlaceDispoTarif}
                  onChange={(e) =>setNombrePlace(e.target.value)}
                  placeholder='nombre de place'
                  inputProps={{ min: 0 }}
                  className='ajout-input'
                />
                <TextField
                  type='text'
                  value={statut}
                  onChange={(e) =>setStatut(e.target.value)}
                  placeholder='statut'
                  className='ajout-input'
                />
                <button className='btn btn-success'>AJOUTER NOUVEL TARIF</button>
              </div>
             </Form>
            </div>
          </div>
          <div className='tableau-tarif' style={{
            marginTop: margetoptarif, transition: 'margin-top 0.5s',
            height: !afficheFormulaire ? "90%" : '40vh', overflow: overflow,
             display: 'flex', flexDirection: 'column'
          }}>
            <table className='table text-center table-bordered'>
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th>PRIX</th>
                  <th>TYPE</th>
                  <th>NOMBRE DE PLACE</th>
                  <th>STATUT DU SIEGE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {
                  donneetarif.length > 0 && (
                    donneetarif.map((item, index) => (
                      <tr key={index}>
                        <td>{item.description}</td>
                        <td>{item.prix}</td>
                        <td>{item.typeTarif}</td>
                        <td>{item.nombrePlaceDispoTarif}</td>
                        <td>{item.statut}</td>
                        <td style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                          <Link>
                            <AiIcons.AiFillEdit onClick={() => editeTarif(item.id)} />
                          </Link>
                          <AiIcons.AiFillDelete color='red' onClick={() => supprimerTarif(item.id)} cursor={'pointer'} />
                        </td>
                      </tr>
                    ))
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tarification