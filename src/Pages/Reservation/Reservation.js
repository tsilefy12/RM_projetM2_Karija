import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import '../Reservation/Reservation.css'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Modal, TextField } from '@mui/material'
import axios from 'axios';
import { AiFillDelete, AiFillQuestionCircle, AiOutlineClose } from 'react-icons/ai';
import Swal from 'sweetalert2';

function Reservation() {
  const [donneResaNom, setDonneResaNom] = useState([]);
  const [email, setEmail] = useState([]);
  const [phone, setPhone] = useState([]);
  const [numVol, setNumeroVol] = useState([]);
  const [montant, setMontant] = useState([]);
  const [idP, setId] = useState([]);
  const [NombreListe, setNombreListe] = useState("");
  const [recherche, setRecherche] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] =  useState(false);
  const [idSupp, setIdSupp] = useState("");
  const [lieuDepart, setLieuDepart] = useState("");
  const [lieuAr, setLiueAr] = useState("");

  useEffect(() => {
    verificationRechercherResa();
  })
  const afficherResa = async () => {
    try {
      const res = await axios.get(`http://localhost:5077/api/Reservation/afficher-toutes`);
      const donneeObj = res.data;
      const tableauDonnees = Object.values(donneeObj);
      setNombreListe(donneeObj.passagers.length);
      if (Array.isArray(tableauDonnees) && tableauDonnees.length > 0) {
        const firstElement = tableauDonnees[0];
        if (firstElement[0] && firstElement[0].nomPassager) {
          const emails = firstElement.map(item => item.email);
          const name = firstElement.map(n => n.nomPassager);
          const phones = firstElement.map(v => v.telephone);
          const idp = firstElement.map(t => t.idPassager);
          setDonneResaNom(name);
          setEmail(emails);
          setPhone(phones);
          setId(idp);
        }

        const secondeElement = tableauDonnees[2];
        if (secondeElement[0] && secondeElement[0].numeroVol) {
          const numero = secondeElement.map(v => v.numeroVol);
          setNumeroVol(numero);
          const liued = secondeElement.map(ld =>ld.lieuDepart);
          setLieuDepart(liued);
          const lieuA = secondeElement.map(la =>la.lieuArrivee);
          setLiueAr(lieuA);
        }

        const troisiemeElement = tableauDonnees[3];
        if (troisiemeElement[0] && troisiemeElement[0].prix) {
          const prix = troisiemeElement.map(p => p.prix);
          setMontant(prix);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const rechercherResa = async () => {
    try {
      const response = await axios.get(`http://localhost:5077/api/Reservation/recherche-reservation/${recherche}`);
      const donneeObj = response.data;
      setNombreListe(donneeObj.passagers.length);
      if (donneeObj.passagers == 0) {
        const msg2 = (<label className='text-danger'>Aucun résultat correspond à votre recherche</label>);
        setMessage(msg2);
        setOpen(true)
      } else {
        const tableauDonnees = Object.values(donneeObj);
        setNombreListe(donneeObj.passagers.length);
        if (Array.isArray(tableauDonnees) && tableauDonnees.length > 0) {
          const firstElement = tableauDonnees[0];
          if (firstElement[0] && firstElement[0].nomPassager) {
            const emails = firstElement.map(item => item.email);
            const name = firstElement.map(n => n.nomPassager);
            const phones = firstElement.map(v => v.telephone);
            const idp = firstElement.map(t => t.idPassager);
            setDonneResaNom(name);
            setEmail(emails);
            setPhone(phones);
            setId(idp);
          }

          const secondeElement = tableauDonnees[2];
          if (secondeElement[0] && secondeElement[0].numeroVol) {
            const numero = secondeElement.map(v => v.numeroVol);
            setNumeroVol(numero);
          }

          const troisiemeElement = tableauDonnees[3];
          if (troisiemeElement[0] && troisiemeElement[0].prix) {
            const prix = troisiemeElement.map(p => p.prix);
            setMontant(prix);
          }
        }
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

  const supprimerResa = async (id) => {
    console.log("id supp ", id);
    await axios.delete(`http://localhost:5077/api/Reservation/supprimer-reservation/${id}`).then(({ data }) => {
      const msg = (<label className='text-danger'>{data}</label>);
      setOpen(true);
      setMessage(msg)
    })
    setOpenDialog(false);
    afficherResa();
  }
 const deleted = (a) =>{
   setOpenDialog(true);
   setIdSupp(a);
 }
  const fermerModal = () =>{
    setOpen(false)
    setRecherche("")
    verificationRechercherResa();
  }
  const viderResa = async () =>{
    await axios.delete(`http://localhost:5077/api/Reservation/vider-reservation?num=21`).then(({data}) =>{
      console.log("message :", data);
    })
  }
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
              <label>Nombre du passager : {NombreListe}</label>
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
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Numéro vol</th>
                    <th>Lieu depart</th>
                    <th>Lieu d'arrivéé</th>
                    <th>Prix</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {donneResaNom.map((nom, index) => (
                    <tr key={index}>
                      <td>{idP[index]}</td>
                      <td>{nom}</td>
                      <td>{email[index]}</td>
                      <td>{phone[index]}</td>
                      <td>{numVol[index]}</td>
                      <td>{lieuDepart[index]}</td>
                      <td>{lieuAr[index]}</td>
                      <td>{montant[index]}</td>
                      <td>
                     
                        <AiFillDelete size={20} color='red'
                          onClick={() => deleted(idP[index])}
                          style={{ cursor: 'pointer' }} />
                      </td>
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
                <label className='text text-center text-danger'>{message}</label>
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                  <AiOutlineClose onClick={() =>fermerModal()} style={{ cursor: 'pointer' }} size={25} />
                </div>
              </Box>
            </Modal>
            <Dialog
            open={openDialog}
            disablePortal = {true}
            >
              <DialogTitle className='text-danger'>Information</DialogTitle>
              <DialogContent>
                Voulez-vous supprimer cette réservation 
                <AiFillQuestionCircle size={40}/>
              </DialogContent>
              <DialogActions>
                <Button onClick={() =>supprimerResa(idSupp)}>Oui</Button>
                <Button onClick={() =>setOpenDialog(false)}>Non</Button>
              </DialogActions>
            </Dialog>
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