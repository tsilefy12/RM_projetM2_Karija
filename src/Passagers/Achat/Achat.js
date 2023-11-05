import React, { useEffect, useState } from 'react'
import MenuPassager from '../MenuPassager/MenuPassager'
import '../Achat/Achat.css'
import { TextField, InputAdornment } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import * as AiIcons from "react-icons/ai"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import MVola from '../../images/photo_113_63.jpg'
import AirtelMoney from '../../images/téléchargement (1).png'
import OrangeMoney from '../../images/téléchargement (2).png'
import bancaire from '../../images/images.png'
import { Form, Image } from 'react-bootstrap';
import axios from 'axios';

function Achat() {
    const [recherche, setRecherche] = useState("")
    const [AfficherPaiement, setPaiement] = useState(true)
    const [open, setOpen] = React.useState(false);
    const [openAirtelMoney, setOpenAirtelMoney] = React.useState(false);
    const [openOrangeMoney, setOpenOrangeMoney] = React.useState(false);
    const [openCarteBancaire, setOpenCarteBancaire] = React.useState(false);
    const [messageVide, setMessageVide] = useState("");

    const [idP, setIdP] = useState("");
    const [nom, setNom] = useState("");
    const [prix, setPrix] = useState("");
    const [type, setType] = useState("");
    const [montant, setMontant] = useState("");
    const [lieuZ, setLieuZ] = useState("");
    const [lieuX, setLieuX] = useState("");
    const [numV, setNumV] = useState("");
    const [datyDep, setDatyDep] = useState("");
    const [telephoneTelma, setTelephoneTelma] = useState("");
    const [telephoneAirtel, setTelephoneAirtel] = useState("");
    const [telephoneOrange, setTelephoneOrange] = useState("");
    const [compteBancaire, setCompteBancaire] = useState("");
    const [modePaiement, setModePaiement] = useState("");
    const [dateTransaction, setDateTransaction] = useState("");

    const [erreurNonValidNumeroTelma, setErreurNonValidNumeroTelma] = useState("");
    const [erreurNonValidNumeroAirtel, setErreurNonValidNumeroAirtel] = useState("");
    const [erreurNonValidNumeroOrange, setErreurNonValidNumeroOrange] = useState("");
    const [erreurNonValidNumeroBancaire, setErreurNonValidNumeroBancaire] = useState("");
    const [erreurMessageChamp, setErreurMessageChamp] = useState("");

    const displayBtnAcheter = (modePaiement == "") ? 'none' : 'block';
    useEffect(() => {
        validationinput();
        verifierNumeroTelma();
        verifierNumeroAirtel();
        verifierNumeroOrange();
        verifierCompteBancaire();
      
    })
    const Afficher = () => {
        setPaiement(!AfficherPaiement);
    }
    const handleOpenModalMVola = () => {
        setOpen(true)
        setModePaiement("MVola");
    };
    const handleOpenModalAirterl = () => {
        setOpenAirtelMoney(true)
        setModePaiement("Airtel Money");
    }
    const handleOpenModalOrange = () => {
        setOpenOrangeMoney(true);
        setModePaiement("Orange Money");
    }
    const handleOpenCarteBancaire = () => {
        setOpenCarteBancaire(true);
        setModePaiement("Carte bancaire");
    }
    const handleClose = () => {
        setOpen(false);
        setOpenAirtelMoney(false);
        setOpenOrangeMoney(false);
        setOpenCarteBancaire(false);
    };
    const PaiemenMode = !AfficherPaiement ? '4%' : '-500%';
    const afficherBtn = !AfficherPaiement ? 'block' : 'none'
    const handleClearRecherche = () => {
        setRecherche("");
    }

    const verifierNumeroTelma = () => {
        const regex = /^(038|034)\d{7}$/;
        const isValid = regex.test(telephoneTelma);

        if (!isValid) {
            const meserror = <label className='text-danger'>Erreur numéro invalide</label>;
            setErreurNonValidNumeroTelma(meserror);
        } else {
            const meserror = <label className='text-success'>Numéro valide</label>;
            setErreurNonValidNumeroTelma(meserror);
        }
    }
    const verifierNumeroAirtel = () => {
        const regex = /^(033)\d{7}$/;
        const isValid = regex.test(telephoneAirtel);

        if (!isValid) {
            const meserror = <label className='text-danger'>Erreur numéro invalide</label>;
            setErreurNonValidNumeroAirtel(meserror);
        } else {
            const meserror = <label className='text-success'>Numéro valide</label>;
            setErreurNonValidNumeroAirtel(meserror);
        }
    }
    const verifierNumeroOrange = () => {
        const regex = /^(032)\d{7}$/;
        const isValid = regex.test(telephoneOrange);

        if (!isValid) {
            const meserror = <label className='text-danger'>Erreur numéro invalide</label>;
            setErreurNonValidNumeroOrange(meserror);
        } else {
            const meserror = <label className='text-success'>Numéro valide</label>;
            setErreurNonValidNumeroOrange(meserror);
        }
    }

    const verifierCompteBancaire = () => {
        const numCompte = /^[A-Za-z0-9]+$/;
        const isValid = numCompte.test(compteBancaire);
        if (!isValid) {
            const meserror = <label className='text-danger'>Erreur numéro de compte invalide</label>;
            setErreurNonValidNumeroBancaire(meserror);
        } else {
            const meserror = <label className='text-success'>Numéro valide</label>;
            setErreurNonValidNumeroBancaire(meserror);
        }
    }
    const VerifierReservation = async () => {
        await axios.get(`http://localhost:5077/api/Vente/verification-reservation?Email=${recherche}`).then(({ data }) => {
            if (data == 0) {
                const text = (<label className='text text-danger' style={{ display: (recherche === "") ? 'none' : 'block' }}>Donnée non trouvée</label>)
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
                setModePaiement("")
            } else {
                const donne = data[0]
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
                setMontant(prix);
                const text = (<label className='text-success' style={{ display: (recherche === "" || nom === "") ? 'none' : 'block' }}>Ok, votre recherche est succès!!</label>)
                setMessageVide(text)
            }

        })
    }
    const validationinput = () => {
        if (recherche === "") {
            setMessageVide("")
            setNom("")
            setIdP("")
            setPrix("")
            setType("")
            setMontant("")
            setLieuZ("")
            setLieuX("")
            setNumV("")
            setDatyDep("")
            setErreurMessageChamp("")
        } else{
            VerifierReservation();
        }
    }

    const AcheterBillet = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("passagerId", idP);
        formData.append("montant", montant);
        formData.append("dateTransaction", dateTransaction);
        formData.append("statutPaiement", nom);
        formData.append("modePaiement", modePaiement);
        if (idP == "" || montant == "" || dateTransaction == "" || nom == "" || modePaiement == "") {
            const msg = (<label className='text text-danger'>Les champs sont obligatoires</label>);
            setErreurMessageChamp(msg);
        } else {
            await axios.post(`http://localhost:5077/api/Vente/achat-du-billet`, formData,
                { headers: { 'Content-Type': 'application/json' } }).then(({ data }) => {
                    console.log("message :", data);
                    const msg2 = (<label className='text text-success'>{data}</label>)
                    setErreurMessageChamp(data);
                })
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
                                <label>Lieu de départ :</label>
                                <span className='text text-info' style={{ marginLeft: '4px' }}>{lieuZ}</span>
                            </div>
                            <div className='flex-row' style={{ marginTop: '10px' }}>
                                <label>Lieu d'arrivée :</label>
                                <span className='text text-info' style={{ marginLeft: '4px' }}>{lieuX}</span>
                            </div>
                        </div>
                    </div>
                    <Form onSubmit={AcheterBillet}>
                        <div className='formulaire-ventes-passager flex-box'>
                            <TextField
                                type='number'
                                placeholder='numéro passager'
                                value={idP}
                                sx={{ margin: '6px' }}
                                onChange={(e) => setIdP(e.target.value)}
                                aria-readonly
                            />
                            <TextField
                                type='text'
                                placeholder='nom passager'
                                value={nom}
                                onChange={(e) => setIdP(e.target.value)}
                                sx={{ margin: '6px' }}
                            />
                            <TextField
                                type='number'
                                placeholder='montant'
                                value={prix}
                                onChange={(e) => setMontant(e.target.value)}
                                sx={{ margin: '6px' }}
                            />
                            <TextField
                                type='date'
                                size='small'
                                value={dateTransaction}
                                onChange={(e) => setDateTransaction(e.target.value)}
                                sx={{ margin: '6px' }}
                            />
                            <TextField
                                type='text'
                                value={modePaiement}
                                onChange={(e) => setModePaiement(e.target.value)}
                                placeholder='mode du paiement'
                                sx={{ margin: '6px', display: AfficherPaiement? 'none': 'block' }}
                                aria-readonly
                            />
                            <div className='flex'>
                                <button className='btn btn-info grow' style={{ margin: "6px", display: displayBtnAcheter }}>Acheter maintenant</button>
                                <span style={{ marginTop: "10px" }}>{erreurMessageChamp}</span>
                            </div>
                        </div>
                    </Form>
                    <div className='flex'>
                        <button className='btn btn-success grow' style={{ margin: "6px" }} onClick={() => Afficher()}>Mode paiement</button>
                        <button className='btn btn-secondary grow' style={{ margin: "6px" }}>Pas maintenant</button>
                    </div>
                    <div className='flex-box mode-paiement' style={{ marginTop: PaiemenMode, transition: 'margin-top 1s' }}>
                        <Image src={MVola} width={180} height={120} style={{ margin: "10px" }} className='img-paiement grow' onClick={() => handleOpenModalMVola()} />
                        <Image src={AirtelMoney} width={180} height={120} style={{ margin: "10px" }} className='img-paiement grow' onClick={() => handleOpenModalAirterl()} />
                        <Image src={OrangeMoney} width={180} height={120} style={{ margin: "10px" }} className='img-paiement grow' onClick={() => handleOpenModalOrange()} />
                        <Image src={bancaire} width={180} height={120} style={{ margin: "10px" }} className='img-paiement grow' onClick={() => handleOpenCarteBancaire()} />
                    </div>
                    <Modal
                        open={open}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <header className='text-info' style={{ marginTop: '-2%' }}>
                                Veuillez saisir votre numéro de téléphone Telma
                            </header>
                            <div className='body-mvola'>
                                <TextField
                                    type='text'
                                    value={telephoneTelma}
                                    onChange={(e) => setTelephoneTelma(e.target.value)}
                                    helperText={erreurNonValidNumeroTelma}
                                />
                                <span>Montant à payer : {montant}</span><br></br>
                                <div className='flex-row'>
                                    <button className='btn btn-success grow'>Retrait</button>
                                    <button className='btn btn-danger grow' style={{ float: 'right' }} onClick={() => handleClose()}>Non</button>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                    <Modal
                        open={openAirtelMoney}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <header className='text-info' style={{ marginTop: '-2%' }}>
                                Veuillez saisir votre numéro de téléphone Airtel
                            </header>
                            <div className='body-mvola'>
                                <TextField
                                    type='text'
                                    value={telephoneAirtel}
                                    onChange={(e) => setTelephoneAirtel(e.target.value)}
                                    helperText={erreurNonValidNumeroAirtel}
                                />
                                <span>Montant à payer : {montant}</span>
                                <div className='flex-row'>
                                    <button className='btn btn-success grow'>Retrait</button>
                                    <button className='btn btn-danger grow' style={{ float: 'right' }} onClick={() => handleClose()}>Non</button>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                    <Modal
                        open={openOrangeMoney}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <header className='text-info' style={{ marginTop: '-2%' }}>
                                Veuillez saisir votre numéro de téléphone Orange
                            </header>
                            <div className='body-mvola'>
                                <TextField
                                    type='text'
                                    value={telephoneOrange}
                                    onChange={(e) => setTelephoneOrange(e.target.value)}
                                    helperText={erreurNonValidNumeroOrange}
                                />
                                <span>Montant à payer : {montant}</span>
                                <div className='flex-row'>
                                    <button className='btn btn-success grow'>Retrait</button>
                                    <button className='btn btn-danger grow' style={{ float: 'right' }} onClick={() => handleClose()}>Non</button>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                    <Modal
                        open={openCarteBancaire}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <header className='text-info' style={{ marginTop: '-2%' }}>
                                Veuillez saisir le numéro de votre compte bancaire
                            </header>
                            <div className='body-mvola'>
                                <TextField
                                    type='text'
                                    value={compteBancaire}
                                    onChange={(e) => setCompteBancaire(e.target.value)}
                                    helperText={erreurNonValidNumeroBancaire}
                                />
                                <span>Montant à payer : {montant}</span>
                                <div className='flex-row'>
                                    <button className='btn btn-success grow'>Retrait</button>
                                    <button className='btn btn-danger grow' style={{ float: 'right' }} onClick={() => handleClose()}>Non</button>
                                </div>
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
    display: 'flex-column'
};
export default Achat