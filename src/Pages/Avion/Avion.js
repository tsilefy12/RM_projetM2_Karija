import { FormLabel, InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../Avion/Avion.css'
import { Form } from 'react-bootstrap'
import * as AiIcons from "react-icons/ai"
import axios from 'axios'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SA from 'sweetalert2';
import Menu from '../../Menu/Menu'
function Avion() {

  //fenêtr modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //variable pour les données
  const [numeroAvion, setNumeroAvion] = useState("");
  const [modeleAvion, setModelAvion] = useState("");
  const [capacite, setCapacite] = useState("");
  const [donneAvion, setDonneAvion] = useState([]);
  let [message, setMessage] = useState("");
  let [erreurMessageAPI, setErreurMessageAPI] = useState("");
  //input edit
  let [inputRecherche, setInputRecherche] = useState("");

  const [inputEditNumeroAvion, setInputEditNumeroAvion] = useState("");
  const [inputEditModelAvion, setInputEditModelAvion] = useState("");
  const [inputEditCapacite, setInputEditCapacite] = useState(0);
  let [donneEditAvion, setDonneEditAvion] = useState([]);
  const [idEdite, setIdEdite] = useState("");

  useEffect(() => {
    Affichage();
    verificationInput();
  });

  //fonction pour afficher toutes les données via api/avio
  const affichageAvion = async () => {
    await axios.get(`http://localhost:5077/api/avion`).then(({ data }) => {
      (
        setDonneAvion(data)
      )
    },
    ).catch(error => {
      setErreurMessageAPI(error);
    });
  }

  //fonction recherche d'avion
  const RechercheAvion = async () => {
    await axios.get(`http://localhost:5077/api/Avion/recherche-avion/${inputRecherche}`).then(({ data }) => {
      setDonneAvion(data);
    })
  }
  //fonction pour afficher toutes les données ou données de la recherche

  const Affichage = () => {
    if (inputRecherche === "") {
      affichageAvion();
    } else {
      RechercheAvion();
    }
  }
  //Ajout d'un avion function
  const AjouteAvion = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('numeroAvion', numeroAvion);
    formData.append('modelAvion', modeleAvion);
    formData.append('capacite', capacite);

    if (numeroAvion === "" || modeleAvion === "" || capacite === "") {
      let erroMessageInput = (<label style={{ color: 'red' }}>Champ obliagtoire</label>)
      setMessage(erroMessageInput);
    } else {
      let successMessageInput = (<label style={{ color: 'green' }}>Ok</label>)
      setMessage(successMessageInput);
      await axios.post(`http://localhost:5077/api/Avion/Ajout-avion`, formData,
        { headers: { 'Content-Type': 'application/json' }, }).then(({ data }) => {
          console.log("message", data);
          ResetChamps();
        })
      console.log("test");
    }
  }

  //fonction reset(vider les champs après une action)
  const ResetChamps = () => {
    setNumeroAvion("");
    setModelAvion("");
    setCapacite("");
  }

  //validation des formulaires

  const verificationInput = () => {
    if (numeroAvion === "" || modeleAvion === "" || capacite === "") {
      let erroMessageInput = (<label style={{ color: 'red' }}>Champ obligatoire</label>)
      setMessage(erroMessageInput);
    } else {
      let successMessageInput = (<label style={{ color: 'green' }}>Ok</label>)
      setMessage(successMessageInput);
    }
  }
  //fonction pour supprimer un avion
  const SupprimerAvion = (id) => {
    SA.fire({
      title: 'Êtes-vous sûr?',
      text: 'Clickez OUI pour valider et ANNULER pour réfuser!!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "OUI",
      cancelButtonText: 'ANNULER',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5077/api/Avion/suppression-avion/${id}`).then(({ data }) => {
          console.log("message : ", data);
          SA.fire({
            title: "Information de suppression",
            icon: "success",
            text: data
          }
          );
        })
      }
    });
  }
  //fonction edit avion
  const EditAvion = async (id) => {
    await axios.get(`http://localhost:5077/api/Avion/edit-avion/${id}`).then(({ data }) => {
      setDonneEditAvion(data);
      setInputEditNumeroAvion(data.numeroAvion);
      setInputEditModelAvion(data.modelAvion);
      setInputEditCapacite(data.capacite);
    });
    handleOpen();
    setIdEdite(id);
  }

  //fonction pour la modification avion
  const modificationAvion = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('NumeroAvion', idEdite);
    formData.append('modelAvion', inputEditModelAvion);
    formData.append('capacite', inputEditCapacite);

    await axios.post(`http://localhost:5077/api/Avion/modification-avion/${idEdite}`,
      formData, {
      headers:
      {
        'Content-Type': 'application/json'
      },
    }).then(({ data }) => {
      console.log(data);
      setIdEdite('');
      setInputEditModelAvion('');
      setInputEditCapacite('');
      handleClose();
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <div className="rehetra">
        <Menu/>
        <div className='tout-avion'>
        <div className='entête'>
          <header className='header-avion'>
            <h1 className='text text-info'>GESTION<sub style={{ fontSize: '1em' }}>AVION</sub></h1>
          </header>
        </div>
        <div className='contenue'>
        <div>
        <Form onSubmit={AjouteAvion} className='from'>
            <div className='form-group'>
              <div className='TextField'>
                <TextField
                  label="Numéro d'avion"
                  placeholder="saisir le nuémero d'avion"
                  type='text'
                  value={numeroAvion}
                  onChange={(e) => { setNumeroAvion(e.target.value) }}
                  autoComplete='off'
                  sx={{ label: { color: 'darkgrey', fontSize: '1em',
                   marginTop: '-8px' }, zIndex: 0 }}
                   className='test'
                />
              </div>
              <div className='TextField'>
                <TextField
                  label="Modèle de l'avion"
                  placeholder='saisir son modèle'
                  type='text'
                  autoComplete='off'
                  value={modeleAvion}
                  onChange={(e) => { setModelAvion(e.target.value) }}
                  sx={{ label: { color: 'darkgrey', fontSize: '1em',
                   marginTop: '-8px' }, zIndex: 0 }}
                   className='test'
                   
                />
              </div>
              <div className='TextField'>
                <TextField
                  label="Capacité"
                  type='number'
                  value={capacite}
                  onChange={(e) => { setCapacite(e.target.value) }}
                  inputProps={{ min: 0 }}
                  sx={{ label: { color: 'darkgrey', fontSize: '1em',
                   marginTop: '-8px' },  zIndex: 0  }}
                   helperText={message}
                   className='test'
                />
              </div>
              <div className='TextField'>
                <button className='btn btn-success grow'><AiIcons.AiFillHdd/>
                 ENREGISTRER</button>
              </div>
            </div>
          </Form>
        </div>
        <div className='affichage-avion'>
        <div className='card'>
            <div className='card-header'>
              <div className='liste-avion'>
                <FormLabel className='liste text-info'>
                  Liste d'avion
                </FormLabel></div>
              <div className='recherche-avion'>
                <TextField
                  label="Rechercher"
                  type='text'
                  value={inputRecherche}
                  sx={{ input: { fontSize: '1.2em', width: '200px' }, label: { color: 'darkgrey', fontSize: '1.1em', marginTop: "-6px"} }}
                  onChange={(e) => (
                    setInputRecherche(e.target.value)
                  )}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='start'>
                        <AiIcons.AiOutlineSearch></AiIcons.AiOutlineSearch>
                      </InputAdornment>
                    )
                  }}
                  size='small'
                /></div>
            </div>
            <div className='card-body'>
              <div className='tableau-avion'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NUMERO D'AVION</th>
                      <th>MODE DE L'AVION</th>
                      <th>CAPACITE</th>
                      <th style={{width: "80px"}}>OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      donneAvion.length > 0 && (
                        donneAvion.map(item => (
                          <tr key={item.id}>
                            <td className='num-avion'>{item.id}</td>
                            <td className='num-avion'>{item.numeroAvion}</td>
                            <td className='model-avion'>{item.modelAvion}</td>
                            <td className='capacite-avion'>{item.capacite}</td>
                            <td className='operations-btn'>
                              <AiIcons.AiFillEdit style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                onClick={() => EditAvion(item.id)
                                }>
                              </AiIcons.AiFillEdit>
                              <button style={{ border: 'none', background: 'none' }} onClick={() => SupprimerAvion(item.id)}>
                                <AiIcons.AiFillDelete style={{ color: 'red' }}>
                                </AiIcons.AiFillDelete>
                              </button>
                            </td>
                          </tr>
                        )))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='card-footer text-center'>
              {
                (donneAvion.length === 0) ? (
                  <span colSpan="4" style={{ color: 'red', textAlign: 'center' }}>
                    Le tableau est vide : Peut être que le serveur de l'api ne pas
                    encore activer ou 0 enregistrement dans la base de données.</span>
                ) :
                  <span colSpan="4" style={{ textAlign: 'center' }} className='text-success'>
                    Il y a {donneAvion.length} avion(s) enrégistrés dans la base de données des compagnies aériennes</span>
              }
            </div>
          </div>
        </div>
        </div>
          {/* //fenêtre modal edit */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Form onSubmit={modificationAvion}>
                <div>
                  <div>
                    <header>
                      <h2 className='text text-center text-info' style={{ marginBottom: '6px' }}>MODIFICATION</h2>
                    </header>
                  </div>
                  <div className='edite-avion-formulaire'>
                    <label className='label-avion'>Numéro</label>
                    <input
                      type='text'
                      className='form-control'
                      autoComplete='off'
                      value={inputEditNumeroAvion}
                      onChange={(e) => setInputEditNumeroAvion(e.target.value)}
                      readOnly
                      style={{ backgroundColor: 'darkgrey' }}
                    />
                  </div>
                  <div className='edite-avion-formulaire'>
                    <label className='label-avion'>Model de l'avion</label>
                    <input
                      type='text'
                      className='form-control'
                      autoComplete='off'
                      value={inputEditModelAvion}
                      onChange={(e) => setInputEditModelAvion(e.target.value)}
                    />
                  </div>
                  <div className='edite-avion-formulaire'>
                    <label className='label-avion'>Capacité</label>
                    <input
                      type='number'
                      min={0}
                      className='form-control'
                      autoComplete='off'
                      value={inputEditCapacite}
                      onChange={(e) => setInputEditCapacite(e.target.value)}
                    />
                  </div>

                  <div className='boutton-avion-update'>
                    <button className='btn btn-primary grow'>+ENREGISTRER</button>
                    <span onClick={handleClose} className='btn btn-danger grow' style={{ cursor: 'pointer' }}>RETOUR</span>
                  </div>
                </div>
              </Form>
            </Box>
          </Modal>
        </div>
    </div>
  )
}

const style = {
  position: 'absolute',
  top: '35%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 2,
  pb: 3,
  border: 'none',
};
export default Avion