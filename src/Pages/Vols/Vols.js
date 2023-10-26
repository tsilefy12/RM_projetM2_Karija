import React, { useEffect } from 'react'
import Menu from '../../Menu/Menu'
import '../Vols/Vol.css'
import {Form } from 'react-bootstrap'
import { TextField, InputAdornment } from '@mui/material'
import * as AiIcons from "react-icons/ai"
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

function Vols() {
  const [donneVol, setDonneVol] = useState([]);
  const [inputRechercheVol, setInputRechercheVol] = useState("");
  const [erreurMessageAPI, setErreurMessageAPI] = useState("");
  const [messageData, setMessageData] = useState("");
  const [messageOk, setMessageOk] = useState("");

  const [numVol, setNumVol] = useState("");
  const [avionId, setAvionId] = useState([]);
  const [dateDepart, setDateDepart] = useState("");
  const [heureDepart, setHeureDepart] = useState("");
  const [lieuDepart, setLieurDepart] = useState("");
  const [lieuArrivee, setLieuArrivee] = useState("");
  const [capaciteMax, setCapaciteMax] = useState("");
  const [avionNum, setAvionNum] = useState("");
  const [text, setText] = useState("Selectionner");


  useEffect(() => {
    afficher();
    SelectNum();
    setMessageData();
  })

  let AfficherVol = async () => {
    await axios.get(`http://localhost:5077/api/Vol`).then(({ data }) => {
        setDonneVol(data)
    }).catch(error => {
      setErreurMessageAPI(error);
    });
  }

  const RechercheVol = async () =>{
    await axios.get(`http://localhost:5077/api/Vol/recherche-vol?search=${inputRechercheVol}`).then(({data}) =>{
      setDonneVol(data);
    })
  } 

  const afficher = () =>{
    if (inputRechercheVol === "") {
    AfficherVol();
    } else {
      RechercheVol();
    }
  }
  const AjoutVol = async () => {
    const formData = new FormData();
    console.log("id " , avionNum);
    formData.append("avionid", avionNum);
    formData.append("numeroVol", numVol);
    formData.append("dateDepart", dateDepart.split('T')[0]);
    formData.append("heureDepart", heureDepart+":"+"00");
    formData.append("capaciteMax", capaciteMax);
    formData.append("lieuDepart", lieuDepart);
    formData.append("lieuArrivee", lieuArrivee);
    try {
      const response = await axios.post(
        "http://localhost:5077/api/Vol/ajout-vol",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );
      const data = response.data;
      let message2 = <label className="text-success">{data}</label>;
      setMessageOk(message2);
      setNumVol("")
      setText("Selectionner")
      setDateDepart("")
      setHeureDepart("")
      setCapaciteMax("")
      setLieuArrivee("")
      setLieurDepart("")
      // Reste du code pour réinitialiser les états
    } catch (error) {
      console.log("message ", error);
    }

  }

  const ajout = (event) => {
    event.preventDefault(); 
    if (
      avionNum === "" ||
      numVol === "" ||
      dateDepart === "" ||
      heureDepart === "" ||
      capaciteMax === "" ||
      lieuDepart === "" ||
      lieuArrivee === ""
    ) {
      
      let message = <label className="text-danger">Les champs sont obligatoires</label>;
      setMessageOk(message);
    } else {
      AjoutVol()
  }
} 
  const SupprimerVol = async (id) => {
    await axios.delete(`http://localhost:5077/api/Vol/supprimer-vol?id=${id}`).then(({ data }) => {
      console.log("supprimer vol ", data);
    })
    AfficherVol();
  }

  const editVol = async (edit) =>{
    await axios.get(`http://localhost:5077/api/Vol/edit-vol/${edit}`).then(({data}) =>{
      setNumVol(data.numeroVol);
      console.log("data ", data);
    })
  }
  const SelectNum= async() =>{
    await axios.get(`http://localhost:5077/api/Avion/num-avion`).then(({data}) =>{
       setAvionId(data)
    })
  }
  const SelectCapacite= async() =>{
    if (avionNum == "Selectionner") {
      setCapaciteMax("")
    } else {
      console.log("nu avion ", avionNum)
      await axios.get(`http://localhost:5077/api/Avion/num-avion/${avionNum}`).then(({data}) =>{
        if (data == 0) {
          setCapaciteMax("")
        } else {
          data.map((e) =>{
            setCapaciteMax(e.capacite)
          })
        }
    })
   
  }}
  return (
    <div className='vol-menu'>
      <div>
        <Menu />
      </div>
      <div className='vols'>
        <div className='text-header'>
          <h2 className='text text-info'>ENREGISTREMENT DU VOL DE LA COMPAGIE AERIENNE</h2>
          <label>{messageOk}</label>
        </div>
        <div className='body-vol'>
          <Form onSubmit={ajout} className='form'>
            <div className='formulaire-1'>
              <div className='form-group-vol'>
                <TextField
                  // label="Numéro vol"
                  type='text'
                  value={numVol}
                  onChange={(e) => setNumVol(e.target.value)}
                  size='normal'
                  variant='standard'
                  placeholder='numéro vol'
                  className='input'
                  autoComplete='off'
                />
              </div>
              <div className='form-group-vol'>
              
              <select style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', 
              borderTop: 'none', borderBottom: '1px solid gray', backgroundColor: 'rgb(238, 238, 240)'}}
              onChange={(e) =>setAvionNum(e.target.value)}>
               <option value="" style={{color: "darkgray"}}>{text}</option>
              {
                avionId.length > 0 && (
                  avionId.map((e, i) =>(
                    <option key={i} value={e.id} onClick={() =>SelectCapacite()}>{e.id}</option>
                  ))
                )
              }
              </select>
              </div>
              <div className='form-group-vol'>
                <TextField
                  // label="Lieu de départ"
                  type='text'
                  value={lieuDepart}
                  onChange={(e) => setLieurDepart(e.target.value)}
                  size='normal'
                  variant='standard'
                  placeholder="lieu de départ"
                  autoComplete='off'
                />
              </div>
              <div className='form-group-vol'>
                <TextField
                  // label="Lieu d'arrivée"
                  type='text'
                  value={lieuArrivee}
                  onChange={(e) => setLieuArrivee(e.target.value)}
                  size='normal'
                  variant='standard'
                  placeholder="lieu d'arrivée"
                  autoComplete='off'
                />
              </div>
            </div>
            <div className='formulaire-2'>
              <div className='form-group-vol'>
                <TextField
                  // label="Capacité"
                  type='number'
                  value={capaciteMax}
                  size='normal'
                  inputProps={{ min: 0 }}
                  variant='standard'
                  placeholder='capacité'
                  autoComplete='off'
                  aria-readonly
                />
              </div>
              <div className='form-group-vol'>
              <label style={{marginRight: "10px", color: "darkgray"}}>Date départ : </label>
                <TextField
                  type='date'
                  value={dateDepart}
                  onChange={(e) => {
                    setDateDepart(e.target.value);
                  }}
                  size='small'
                  variant='standard'
                  autoComplete='off'
                />
              </div>
              <div className='form-group-vol'>
              <label style={{marginRight: "14px", marginTop: "4px",color: "darkgray"}}>Heure : </label>
                <TextField
                  // label="Heure départ"
                  type='time'
                  value={heureDepart}
                  onChange={(e) => setHeureDepart(e.target.value)}
                  size='normal'
                  variant='standard'
                  placeholder='heure du départ'
                  autoComplete='off'
                />
              </div>
              <button className='btn grow' style={{ marginBottom: "4px", marginTop: "-2%" }}>
                <AiIcons.AiFillFolderAdd style={{ width: "130px", height: "50px", color: "#07af6f" }}></AiIcons.AiFillFolderAdd>
              </button>
            </div>
          </Form>
        </div>
        <div className='tableau-vol'>
          <div className='recherche-vol'>
            <div className='info-vol'>
              <label className='text text-info' style={{ fontSize: "1.5em" }}>Affichage des vols</label>
              <span className='text text-info' style={{ fontSize: "1.5em" }}>{(donneVol.length <= 1) ? 
              donneVol.length +" vol" : donneVol.length + " Vols"}</span>
            </div>
            <div className='search'>
              <TextField type='text' className='form-control text' placeholder='recherche...'
                value={inputRechercheVol}
                onChange={(event) => setInputRechercheVol(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='start'>
                      <AiIcons.AiOutlineSearch></AiIcons.AiOutlineSearch>
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>
          <div className='vol-tab'>
            <table className='table' id='custom'>
              <thead>
                <tr>
                  <th>N° vol</th>
                  <th>Lieu de départ</th>
                  <th>Lieu d'arrivée</th>
                  <th>Capacité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  donneVol.length > 0 && (
                    donneVol.map((item, index) => (
                      <tr key={index}>
                        <td>{item.numeroVol}</td>
                        <td>{item.lieuDepart}</td>
                        <td>{item.lieuArrivee}</td>
                        <td>{item.capaciteMax}</td>
                        <td>
                        <Link to={`/api/Vol/edit-vol/${item.id}`} >
                          <AiIcons.AiFillEdit style={{ width: '20px', height: '20px', cursor: 'pointer' }}>
                          </AiIcons.AiFillEdit>
                        </Link>
                          <button style={{ border: 'none', background: 'none' }} onClick={() => SupprimerVol(item.id)}>
                            <AiIcons.AiFillDelete style={{ color: 'red' }}>
                            </AiIcons.AiFillDelete>
                          </button>
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

export default Vols