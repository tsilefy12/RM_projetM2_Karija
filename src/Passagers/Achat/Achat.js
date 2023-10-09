import React, { useEffect, useState } from 'react'
import MenuPassager from '../MenuPassager/MenuPassager'
import '../Achat/Achat.css'
import { TextField, InputAdornment} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import * as AiIcons from "react-icons/ai"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import MVola from '../../images/photo_113_63.jpg'
import AirtelMoney from '../../images/téléchargement (1).png'
import OrangeMoney from '../../images/téléchargement (2).png'
import bancaire from '../../images/images.png'
import { Image } from 'react-bootstrap';
import axios from 'axios';

function Achat() {
    const [recherche, setRecherche] = useState("")
    const [AfficherPaiement, setPaiement] = useState(true)
    const [open, setOpen] = React.useState(false);
    const [messageVide, setMessageVide] = useState("");

    const [idP, setIdP] = useState("");
    const [nom, setNom] = useState("");
    const [prix, setPrix] = useState("");
    const [type, setType] = useState("");
    const [montant, setMontant] = useState("");
    const [nombrebillet, setNombreBillet] = useState("");
    const [lieuZ, setLieuZ] = useState("");
    const [lieuX, setLieuX] = useState("");
    const [numV, setNumV] = useState("");
    const [datyDep, setDatyDep] = useState("");
    const [telephone, setTelephone] = useState("");


    useEffect(() =>{
        validationinput();
    })
    const Afficher = () => {
        setPaiement(!AfficherPaiement);
    }
    const handleOpenModal = () =>setOpen(true);
    const handleClose = () =>setOpen(false);
    const PaiemenMode = !AfficherPaiement ? '4%' : '-500%';
    const handleClearRecherche = () => {
        setRecherche("");
    }

    const VerifierReservation = async () => {
        await axios.get(`http://localhost:5077/api/Vente/verification-reservation?Email=${recherche}`).then(({ data }) => {
            if (data==0) {
                const text = (<label className='text text-danger' style={{display: (recherche ==="")? 'none': 'block'}}>Donnée non trouvée</label>)
                setMessageVide(text)
                setNom("")
                setIdP("")
                setPrix("")
                setType("")
                setMontant("")
                setLieuZ("")
                setLieuX("")
                setNumV("")
                setDatyDep("")
                setNombreBillet("")
            } else {
                const donne=data[0]
                const idPassager = donne.passager.idPassager;
                const nomPassager = donne.passager.nomPassager;

                const prixTarif = donne.tarif.prix;
                const typeTarif = donne.tarif.typeTarif;

                const lieuDepartVerify = donne.vol.lieuDepart;
                const lieuArriveeVerify = donne.vol.lieuArrivee;
                const numVolVerify = donne.vol.numeroVol;
                const datydepart = donne.vol.dateDepart;

                setIdP(idPassager);
                setNom(nomPassager);
                setPrix(prixTarif);
                setType(typeTarif);
                setLieuZ(lieuDepartVerify);
                setLieuX(lieuArriveeVerify);
                setDatyDep(datydepart);
                setNumV(numVolVerify)
                const text = (<label className='text-success' style={{display: (recherche==="" || nom==="")? 'none': 'block'}}>Ok, votre recherche est succès!!</label>)
                setMessageVide(text)
            }
           
        })
    }
   const validationinput = () =>{
    if (recherche==="") {
        setNom("")
        setIdP("")
        setPrix("")
        setType("")
        setMontant("")
        setLieuZ("")
        setLieuX("")
        setNumV("")
        setDatyDep("")
        setNombreBillet("")
    } else {
        VerifierReservation()
        const calcul = prix * nombrebillet;
        setMontant(calcul);
    }
   }
    return (
        <div className='achat'>
            <MenuPassager />
            <div className='achat-billet-passager'>
                <div>
                    <TextField
                        placeholder='rechercher...'
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
                        className='input-rechercheAchat'
                    />
                   
                </div>
                <span>{messageVide}</span>
                <div className='resultat-verification'>
                    <div className='flex-column search-resa'>
                        <div style={{ float: 'left' }}>

                            <div className='flex-row' style={{ marginTop: '10px' }}>
                                <label>Nom passager : </label>
                                <span className='text text-info' style={{ marginLeft: '4px' }}>{nom}</span>
                            </div>

                            <div className='flex_column' style={{ marginTop: '10px' }}>
                                <div className='flex-row' style={{ marginTop: '10px' }}>
                                    <label>prix de la réservation :</label>
                                    <span className='text text-info' style={{ marginLeft: '4px' }}>{prix}</span>
                                </div>
                                <div className='flex-row' style={{ marginTop: '10px' }}>
                                    <label>Type du tarif :</label>
                                    <span className='text text-info' style={{ marginLeft: '4px' }}>{type}</span>
                                </div>
                            </div>
                            <div className='flex-column' style={{ marginTop: '10px' }}>
                                <div className='flex-row' style={{ marginTop: '10px' }}>
                                    <label>Numéro du vol :</label>
                                    <span className='text text-info' style={{ marginLeft: '4px' }}>{numV}</span>
                                </div>
                                <div className='flex-row' style={{ marginTop: '10px' }}>
                                    <label>La date de départ :</label>
                                    <span className='text text-info' style={{ marginLeft: '4px' }}>{datyDep}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex-box informations-billet'>
                            <div className='flex-row' style={{ marginTop: '10px' }}>
                                <label>Montant total :</label>
                                <span className='text text-info' style={{ marginLeft: '4px' }}>{montant}</span>
                            </div>
                            <div className='flex-row' style={{ marginTop: '10px' }}>
                                <label>Nombre de billet :</label>
                                <span className='text text-info' style={{ marginLeft: '4px' }}>{nombrebillet}</span>
                            </div>
                            <div className='flex-row' style={{ marginTop: '10px' }}>
                                <label>Lieu de départ :</label>
                                <span className='text text-info' style={{ marginLeft: '4px' }}>{lieuZ}</span>
                            </div>
                            <div className='flex-row' style={{ marginTop: '10px' }}>
                                <label>Lieu d'arrivée :</label>
                                <span className='text text-info' style={{ marginLeft: '4px' }}>{lieuX}</span>
                            </div>
                        </div>
                    </div>
                    <div className='formulaire-ventes-passager flex-box'>
                        <TextField
                            type='number'
                            placeholder='numéro passager'
                            value={idP}
                            sx={{ margin: '6px' }}
                            onChange={(e) =>setIdP(e.target.value)}
                            aria-readonly
                        />
                        <TextField
                            type='text'
                            placeholder='nom passager'
                            value={nom}
                            onChange={(e) =>setIdP(e.target.value)}
                            sx={{ margin: '6px' }}
                        />
                        <TextField
                            type='number'
                            placeholder='montant'
                            value={montant}
                            onChange={(e) =>setMontant(e.target.value)}
                            sx={{ margin: '6px' }}
                        />
                        <TextField
                            type='number'
                            placeholder='nombre de billet'
                            sx={{ margin: '6px' }}
                            value={nombrebillet}
                            onChange={(e) =>setNombreBillet(e.target.value)}
                        />
                        <TextField
                            type='date'
                            size='small'
                            sx={{ margin: '6px' }}
                        />
                        <TextField
                            type='text'
                            placeholder='mode du paiement'
                            sx={{ margin: '6px' }}
                        />
                        <button className='btn btn-success grow' style={{ margin: "6px" }} onClick={() => Afficher()}>Mode paiement</button>
                        <button className='btn btn-info grow' style={{ margin: "6px" }}>Acheter maintenant</button>
                        <button className='btn btn-secondary grow' style={{ margin: "6px" }}>Pas maintenant</button>
                    </div>
                    <div className='flex-box mode-paiement' style={{ marginTop: PaiemenMode, transition: 'margin-top 1s' }}>
                        <Image src={MVola} width={180} height={120} style={{ margin: "10px" }} className='img-paiement grow' onClick={() =>handleOpenModal()} />
                        <Image src={AirtelMoney} width={180} height={120} style={{ margin: "10px" }} className='img-paiement grow' />
                        <Image src={OrangeMoney} width={180} height={120} style={{ margin: "10px" }} className='img-paiement grow' />
                        <Image src={bancaire} width={180} height={120} style={{ margin: "10px" }} className='img-paiement grow' />
                        <button className='btn btn-secondary grow boutton-paiement'
                            style={{ margin: "30px", float: 'right', marginRight: '30px' }}
                            onClick={() => VerifierReservation()}
                        >Autres paiement</button>
                    </div>
                    <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <header className='text-info' style={{marginTop: '-2%'}}>
                                Veuillez saisir votre numéro de téléphone
                            </header>
                            <div className='body-mvola'>
                                    <TextField
                                        type='text'
                                        value={telephone}
                                        onChange={(e) =>setTelephone(e.target.value)}
                                    />
                                    <span>Montant à payer : {montant}</span>
                            </div>
                        </Box>
                    </Modal>
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
    width: 300,
    height: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 2,
    pb: 3,
    border: 'none',
  };
export default Achat