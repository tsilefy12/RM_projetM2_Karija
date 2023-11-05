import React, { useEffect, useState } from 'react'
import MenuPassager from '../MenuPassager/MenuPassager'
import '../Profil/Profil.css'
import { Form, Image } from 'react-bootstrap'
import photo from '../../icons/IMG_20210322_075139.jpg'
import sky from '../../images/images (3).jpg'
import { AiFillCamera, AiFillEdit } from 'react-icons/ai'
import { TextField } from '@mui/material'
import axios from 'axios'

function Profil() {
  const [donne, setDonne] = useState([]);
  const [mailaka, setMailaka] = useState("");
  const [contact, setContact] = useState("");
  const [adresse, setAdresse] = useState("");
  const [id, setId] = useState("");
  const [inputModif, setInputModif] = useState("");
  const [inputEditTelephone, setEditTelephone] = useState("");
  const [inputEditAdresse, setEditAdresse] = useState("");
  const [nom, setNom] = useState("");
  const [donneMail, setDonneMail] = useState([]);
  const [donnePhone, setDonnePhone] = useState([]);
  const [donneAdresse, setDonneAdresse] = useState([]);

  useEffect(() =>{
    afficher();
  })
  const afficher = async () =>{
    await axios.get(`http://localhost:5077/api/Passagers`).then(({data}) =>{
      setDonne(data)
    })
    donne.map((e) =>(
      setMailaka(e.email),
      setId(e.idPassager),
      setContact(e.telephone),
      setAdresse(e.adressepassager),
      setNom(e.nomPassager)
    ))
  }
  const editMail = async () =>{
    console.log("id ", id);
    await axios.get(`http://localhost:5077/api/Passagers/edit-mail/${id}`).then(({data}) =>{
      setDonneMail(data)
    })
    donneMail.map((m) =>(
      setInputModif(m.email)
    ))
  }
  const modifier = async (e) =>{
    e.preventDefault();
    const formData = new FormData();
    const mail = inputModif !="" ? inputModif : mailaka;
    const phone = inputEditTelephone !="" ? inputEditTelephone : contact;
    const lot = inputEditAdresse !="" ? inputEditAdresse : adresse;
    formData.append("idPassager", 0);
    formData.append("nomPassager", "string");
    formData.append("adressepassager", lot);
    formData.append("telephone", phone);
    formData.append("email", mail);
    formData.append("password", "string");

    await axios.post(`http://localhost:5077/api/Passagers/modification-profil-passager/${id}`,
    formData, {headers:{'Content-Type': 'application/json'}}
    ).then(({data}) =>{
      console.log("message ", data);
    })
    afficher();
    setEditAdresse("")
    setEditTelephone("")
    setInputModif("")
  }
  const editPhone = async () =>{
    await axios.get(`http://localhost:5077/api/Passagers/edit-Phone/${id}`).then(({data}) =>{
      setDonnePhone(data);
    })
    donnePhone.map((p) =>(
      setEditTelephone(p.telephone)
    ))
  }
  const editAdresse = async () =>{
    await axios.get(`http://localhost:5077/api/Passagers/edit-adresse/${id}`).then(({data}) =>{
      setDonneAdresse(data);
    })
    donneAdresse.map((a) =>{
      setEditAdresse(a.adressepassager);
    })
  }

  const showBtn = (inputEditAdresse != "" || inputEditTelephone !="" || inputModif !="") ? 'block': 'none';
  return (
    <div className='profil'>
      <MenuPassager />
      <div className='tewt'>
      <div className='profil-contenu'>
        <div className='Photo-profil'>
          <Image src={photo} className='sary-profil' />
          <span style={{cursor: 'pointer'}}>
          <AiFillCamera size={45} style={{marginLeft: '42%', marginTop: '-25%'}}  className='text-primary'/>
          </span>
        </div>
        <div className='contenu-profil'>
          <div className='formulaires-profil'>
            <label>Nom passager :</label>
            <span>{nom}</span>
          </div>
          <div className='editer-passager'>
            <span><AiFillEdit size={20} style={{cursor: 'pointer', display: 'none'}} className='text-primary'/></span>
          </div>
          <div className='formulaires-profil'>
            <label>Adresse mail :</label>
            <span>{mailaka}</span>
          </div>
          <div className='editer-passager'>
            <span><AiFillEdit size={20} style={{cursor: 'pointer'}}  className='text-primary' 
            onClick={() =>editMail()}/></span>
          </div>
          <div className='formulaires-profil'>
            <label>Téléphone :</label>
            <span>{contact}</span>
          </div>
          <div className='editer-passager'>
            <span><AiFillEdit size={20} style={{cursor: 'pointer'}}  className='text-primary'
              onClick={() =>editPhone(id)}
            /></span>
          </div>
          <div className='formulaires-profil'>
            <label>Adresse passager :</label>
            <span>{adresse}</span>
          </div>
          <div className='editer-passager'>
            <span><AiFillEdit size={20} style={{cursor: 'pointer'}}  className='text-primary'
              onClick={() =>editAdresse(id)}
            /></span>
          </div>
        </div>
      </div>
      <div className='edit-value'>
      <Form onSubmit={modifier}>
        <div className='modif-profil'>
         <TextField 
          type='text'
          sx={{marginTop: '5%', display: inputModif =="" ? 'none': 'block' }}
          value={inputModif}
          onChange={(e) =>setInputModif(e.target.value)}
        />
        <TextField 
          type='text'
          sx={{marginTop: '5%', display: inputEditTelephone =="" ? 'none': 'block'}}
          value={inputEditTelephone}
          onChange={(e) =>setEditTelephone(e.target.value)}
        />
        <TextField 
          type='text'
          sx={{marginTop: '5%', display: inputEditAdresse =="" ? 'none': 'block'}}
          value={inputEditAdresse}
          onChange={(e) =>setEditAdresse(e.target.value)}
        />
        <button className='btn btn-primary' style={{marginTop: '10px', display: showBtn}}>Modifier</button>
        
        </div>
        </Form>
        <Image src={sky} width={360} height={195} style={{float: 'right'}}/>
      </div>
      </div>
    </div>
  )
}

export default Profil