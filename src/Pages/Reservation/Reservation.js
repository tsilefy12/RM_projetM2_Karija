import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import '../Reservation/Reservation.css'
import { Box, Modal, TextField } from '@mui/material'
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';

function Reservation() {
  const [donneResa, setDonneResa] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [open, setOpen] = useState(false);
  const [nb, setNb] = useState("");

  useEffect(() => {
    verificationRechercherResa();
  })
  const afficherResa = async () => {
    try {
      const res = await axios.get(`http://localhost:5077/api/Reservation/afficher-toutes`)
      const data = res.data;
      setDonneResa([data])
      // setNb((res.data).length)


    } catch (error) {

    }
  }
  const rechercherResa = async () => {
    try {
      const response = await axios.get(`http://localhost:5077/api/Reservation/recherche-reservation/${recherche}`);
      const data = response.data;
      if (data.passagers == 0) {
        setOpen(true)
      } else {
        setDonneResa([data]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  }
  const verificationRechercherResa = () => {
    if (recherche == "") {
      afficherResa();
    } else {
      rechercherResa();
    }
  }
  const dtest = {
    passagers: [
      {
        nomPassager: "qsdqd",
        email: "sdfsfd@gmail",
        telephone: 136
      },
      {
        nomPassager: "sdfsfd",
        email: "sdfsfsf@g",
        telephone: 3164
      },
      {
        nomPassager: "dsfsfd",
        email: "dsfsdf@gmail.com",
        telephone: 326570207
      }
    ],
    vols: [
      {
        numeroVol: "vol1"
      },
      {
        numeroVol: "vol1"
      },
      {
        numeroVol: "vol2"
      }
    ],
    tarifs: [
      {
        prix: 15000
      },
      {
        prix: 15000
      },
      {
        prix: 15000
      }
    ]
  };

  return (
    <div className='resa-liste'>
      <Menu />
      <div>
        <header className='text text-info header-resaListe'>
          LISTE DES PASSAGERS A LA RESERVATION DU VOL
        </header>
        <div>
          <div className='card rese-card'>
            <div className='card-header resa-header-card'>
              <label>Nombre du passager : 3</label>
              <label>Toutes supprimer</label>
              <TextField
                type='text'
                placeholder='rechercher...'
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                sx={{ backgroundColor: 'white' }}
              />
            </div>
            <div className='card-body resa-card-bodyListe'>
              <table className='table resa-tableau'>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Numéro vol</th>
                    <th>Prix</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(dtest.passagers || dtest.vols || dtest.tarifs).map((ele, index) =>(
                    <tr key={index}>
                      <td>{ele.nomPassager}</td>
                      <td>{ele.email}</td>
                      <td>{ele.telephone}</td>
                      <td>{ele.numeroVol || '-'}</td>
    <td>{ele.prix || '-'}</td>
                      <td>sfs</td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
            <Modal
              open={open}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <label className='text text-center text-danger'>Aucun résultat correspond à votre recherche</label>
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                  <AiOutlineClose onClick={() => (setOpen(false), setRecherche(""))} style={{ cursor: 'pointer' }} size={25} />
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}
const style = {
  position: 'absolute',
  top: '35%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 280,
  height: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 2,
  pb: 3,
  border: 'none',
};
export default Reservation