import React, { useEffect, useState } from 'react'
import MenuPassager from '../MenuPassager/MenuPassager'
import '../prevision/Prevision.css'
import { Form } from 'react-bootstrap'
import { TextField, InputAdornment } from '@mui/material'
import * as AiIcons from "react-icons/ai"
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios'
import { name } from '../Name'
import { useNavigate } from 'react-router'

function Prevision() {
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState("");
  const [donnePrevue, setDonnePrevue] = useState([]);
  const [idP, setIdP] = useState("");
  const [demandePrevue, setDemandePrevue] = useState("");
  const [datePrevue, setDatePrevue] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [messagePrevue, setMessagePrevue] = useState("");

  const [id, setId] = useState("");
  const [nom, setNom] = useState("");
  const [adressemail, setAdresseMail] = useState("");
  const [phone, setPhone] = useState("");
  const [datee, setDate] = useState("");
  const [demandepre, setDemandePre] = useState("");
  const [avisResponsable, setAvisResponsable] = useState("");

  useEffect(() => {
    verifierInput();
  })
  const ajouterDemandePrevue = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("idPassager", idP);
    formData.append("demandePrevue", demandePrevue);
    formData.append("datePrevue", datePrevue);
    formData.append("commentaire", commentaire);

    if (idP === "" || demandePrevue === "" || datePrevue == "" || commentaire === "") {
      const message = (<label className='text-danger'>Les champs sont obligatoires</label>);
      setMessagePrevue(message);
    } else {
      await axios.post(`http://localhost:5077/api/DemandePrevue/demande-prevue`,
        formData, { headers: { 'Content-Type': 'application/json' } }
      ).then(({ data }) => {
        const message2 = (<label className='text-success'>{data}</label>)
        setMessagePrevue(message2);
      })
      setIdP("");
      setCommentaire("");
      setDemandePrevue("");
      setDatePrevue("");
    }
  }
  const handleClearRecherche = () => {
    setRecherche("");
  }

  const RechercherDemande = async () => {
    await axios.get(`http://localhost:5077/api/DemandePrevue/rechercher-demande-prevision?recherche=${recherche}`).then(({ data }) => {
      if (data == 0) {
        setDonnePrevue(data)
        setId("");
        setNom("");
        setAdresseMail("");
        setAvisResponsable("");
        setDate("");
        setDemandePre("");
        setPhone("");
      } else {
        setDonnePrevue(data);
        donnePrevue.map((item) => (
          setId(item.demande.idPrevision),
          setNom(item.passager.nomPassager),
          setAdresseMail(item.passager.email),
          setAvisResponsable(item.demande.commentaire),
          setDate(item.demande.datePrevue),
          setDemandePre(item.demande.demandePrevue),
          setPhone(item.passager.telephone)
        ))

      }
    })
  }
  const daty = new Date(datee);
  const datedemande = daty.toLocaleDateString('en-FR');
  const verifierInput = () => {
    if (recherche == "") {
      setId("");
      setNom("");
      setAdresseMail("");
      setAvisResponsable("");
      setDate("");
      setDemandePre("");
      setPhone("");
    } else {
      RechercherDemande();
    }
  }
  return (
    <>
      {
        (name.length == 0) ? navigate('/') : (
          <div className='prevision'>
            <MenuPassager />
            <div className='contenue-prevision'>
              <header className='text text-success' id='prevision-header'>
                DEMANDE DE LA PREVISION
              </header>
              <div className='formulaires-demande-prevision'>
                <Form onSubmit={ajouterDemandePrevue}>
                  <div className='flex-box'>
                    <TextField
                      type='number'
                      placeholder='id passager'
                      sx={{ margin: '15px' }}
                      className='frm-prevue'
                      value={idP}
                      onChange={(e) => setIdP(e.target.value)}
                    />
                    <TextField
                      type='text'
                      placeholder='avix du responsable'
                      sx={{ margin: '15px' }}
                      className='frm-prevue'
                      value={commentaire}
                      onChange={(e) => setCommentaire(e.target.value)}
                    />
                    <TextField
                      type='date'
                      sx={{ margin: '15px' }}
                      size='small'
                      className='frm-prevue'
                      value={datePrevue.split('T')[0]}
                      onChange={(e) => setDatePrevue(e.target.value)}
                    />
                    <TextField
                      type='text'
                      placeholder='votre demande'
                      sx={{ margin: '15px' }}
                      multiline
                      rows={3}
                      className='frm-prevue'
                      value={demandePrevue}
                      onChange={(e) => setDemandePrevue(e.target.value)}
                    />
                    <label style={{ margin: '50px' }}>{messagePrevue}</label>
                    <div className='flex-box' style={{ width: '100%' }}>
                      <button className='btn btn-success grow frm-prevue' style={{ margin: '15px' }}>ENVOYER LA DEMANDE</button>
                      <TextField
                        type='text'
                        placeholder='rechercher...'
                        sx={{ margin: '15px', width: '70%' }}
                        className='frm-prevue'
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        InputProps={
                          {
                            endAdornment: (
                              <InputAdornment position="end">
                                {recherche && (
                                  <ClearIcon onClick={handleClearRecherche} style={{ cursor: 'pointer' }} />
                                )}
                                <AiIcons.AiOutlineSearch width={20} height={20}></AiIcons.AiOutlineSearch>
                              </InputAdornment>
                            ),
                          }
                        }
                      />
                    </div>
                  </div>
                </Form>
                <div className='afficher-prevision' style={{ marginLeft: '20px' }}>
                  <div className='flex-box'>
                    <label>ID : </label>
                    <span className='text text-success' style={{ marginLeft: '6px' }}>{id} </span>
                  </div>
                  <div className='flex-box'>
                    <label>Nom passager : </label>
                    <span className='text text-success' style={{ marginLeft: '6px' }}>{nom}</span>
                  </div>
                  <div className='flex-box'>
                    <label>Adresse mail : </label>
                    <span className='text text-success' style={{ marginLeft: '6px' }}>{adressemail}</span>
                  </div>
                  <div className='felx-box'>
                    <label>Téléphone : </label>
                    <span className='text text-success' style={{ marginLeft: '6px' }}>{phone}</span>
                  </div>
                  <div className='felx-box'>
                    <label>Date :</label>
                    <span className='text text-success' style={{ marginLeft: '6px' }}>{datedemande}</span>
                  </div>
                  <div className='felx-box'>
                    <label>Demande :</label>
                    <span className='text text-success' style={{ marginLeft: '6px' }}>{demandepre}</span>
                  </div>
                  <div className='flex-box'>
                    <label>Avix du responsable :</label>
                    <span className='text text-success' style={{ marginLeft: '6px' }}>{avisResponsable}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default Prevision