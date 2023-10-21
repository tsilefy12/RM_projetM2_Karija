import React, { useEffect, useState } from 'react'
import MenuPassager from '../MenuPassager/MenuPassager'
import '../demandeAnnulation/DemandeAnnulation.css'
import { TextField, InputAdornment } from '@mui/material'
import * as AiIcons from "react-icons/ai"
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios'
import { Form } from 'react-bootstrap'

function DemandeAnnulation() {
    const [recherche, setRecherche] = useState("");
    const [nom, setNom] = useState("");
    const [phone, setPhone] = useState("");
    const [mail, setMail] = useState("");
    const [dateVoyege, setDateVoyage] = useState("");
    const [heureVoyage, setHeureVoyage] = useState("");
    const [motif, setMotif] = useState("");
    const [modePaye, setModePaye] = useState("");
    const [dateTrans, setDateTrans] = useState("");
    const [dateDemande, setDateDemande] = useState("");
    const [valide, setValide] = useState("non");
    const [numvol, setNumVol] = useState("");
    const [montant, setMontant] = useState("");
    const [msg, setMsg] = useState("");
    const [msg5, setMsg5] = useState("");

    useEffect(() => {
        verificationInput();
    })
    const afficherInformations = async () => {
        await axios.get(`http://localhost:5077/api/Annulation/afficher-informations?email=${recherche}`).then(({ data }) => {
            if (data == 0) {
                const messageVide = (<label className='terxt text-danger'>Données non disponibles</label>);
                setMsg(messageVide);
                setNom("");
                setPhone("");
                setMail("");
                setDateVoyage("");
                setHeureVoyage("");
                setMotif("");
                setModePaye("");
                setDateTrans("");
                setDateDemande("");
                setValide("");
                setNumVol("");
                setMontant("");

            } else {
                const donne = data[0];

                const name = donne.passager.nomPassager;
                const telephone = donne.passager.telephone;
                const mailaka = donne.passager.email;
                const dateV = donne.vol.dateDepart;
                const heure = donne.vol.heureDepart;
                const numv = donne.vol.numeroVol;
                const modeP = donne.venteBillet.modePaiement;
                const datetran = donne.venteBillet.dateTransaction;
                const vola = donne.venteBillet.montant;

                setNom(name);
                setPhone(telephone);
                setMail(mailaka);
                setDateVoyage(dateV);
                setHeureVoyage(heure);
                setNumVol(numv);
                setModePaye(modeP);
                setDateTrans(datetran);
                setMontant(vola);
                const msg3 = (<label className='text text-success'>Vos informations sont trouvées</label>);
                setMsg(msg3);
            }
        })
    }
    const verificationInput = async () => {
        if (recherche == "") {
            setNom("");
            setPhone("");
            setMail("");
            setDateVoyage("");
            setHeureVoyage("");
            setMotif("");
            setModePaye("");
            setDateTrans("");
            setDateDemande("");
            setValide("");
            setNumVol("");
            setMontant("");
            setMsg("");
            setMsg5("");
        } else {
            afficherInformations();
        }
    }

    const FaireDemande = async (e) =>{
        e.preventDefault();
        const formData =new FormData();
        formData.append("mailaka", mail);
        formData.append("nomP", nom);
        formData.append("phone", phone);
        formData.append("numVol", numvol);
        formData.append("dateVoyage", dateVoyege);
        formData.append("heureVoyage", heureVoyage);
        formData.append("motif", motif);
        formData.append("methodePaiement", modePaye);
        formData.append("dateTrans", dateTrans);
        formData.append("numTrans", montant);
        formData.append("dateDemande", dateDemande);
        formData.append("valide", valide);
        
        if (nom == "" || phone == "" || numvol == "" || dateVoyege == "" || 
        heureVoyage == "" || motif == "" || modePaye == "" || dateTrans == "" 
        || montant == "" || dateDemande == "" || valide =="")  {
            const msg1 = (<label className='text text-danger'>Les champs sont obligatoires</label>)
            setMsg5(msg1);
            
        }else if(msg == "Données non disponibles"){
            const mg = (<label className='text-danger'>Vous avez saisi des fausses informations</label>);
            setMsg5(msg5);
        } else {
            await axios.post(`http://localhost:5077/api/Annulation/action-annulation`, 
            formData, {headers:{'Content-Type': 'application/json'}}).then(({data}) =>{
                const msg7 = (<label className='text-success'>{data}</label>);
                setMsg5(msg7);
            })
        }

    }
    const handleClearRecherche = () => {
        setRecherche("");
    }
    return (
        <div className='demande-menu-annulation'>
            <MenuPassager />
            <div className='demande-annulation'>
                <header>
                    <TextField
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        placeholder='saisir votre adresse email par ici...'
                        autoComplete='off'
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
                        sx={{ width: '80%', margin: '10px' }}
                    />
                </header>
                 <Form onSubmit={FaireDemande}>
                 <div className='formulaires-demande-annulation flex-box' 
                 style={{display: recherche ==""? 'none': 'block', transition: 'display 0.5s'}}>
                    <TextField
                        type='text'
                        sx={{ margin: '20px' }}
                        value={nom}
                        className='text-demande-annulation'
                        placeholder='nom passager'
                    />
                    <TextField
                        type='text'
                        sx={{ margin: '20px' }}
                        value={phone}
                        className='text-demande-annulation'
                        placeholder='contact'
                    />
                    <TextField
                        type='number'
                        sx={{ margin: '20px' }}
                        value={montant}
                        className='text-demande-annulation'
                        placeholder='montant'
                    />
                    <TextField
                        type='text'
                        sx={{ margin: '20px' }}
                        value={mail}
                        className='text-demande-annulation'
                        placeholder='adresse email'
                    />
                    <TextField
                        type='text'
                        sx={{ margin: '20px' }}
                        value={modePaye}
                        className='text-demande-annulation'
                        placeholder='mode paiement'
                    />
                    <TextField
                        type='text'
                        sx={{ margin: '20px' }}
                        value={numvol}
                        className='text-demande-annulation'
                        placeholder='numéro du vol'
                    />
                    <TextField
                        type='date'
                        sx={{ margin: '20px' }}
                        value={dateVoyege.split('T')[0]}
                        className='text-demande-annulation'
                        size='small'
                    />
                    <TextField
                        type='date'
                        sx={{ margin: '20px' }}
                        value={dateTrans.split('T')[0]}
                        className='text-demande-annulation'
                        size='small'
                    />
                    <TextField
                        type='time'
                        sx={{ margin: '20px' }}
                        value={heureVoyage}
                        className='text-demande-annulation'
                        size='small'
                    />
                       <TextField
                        type='text'
                        sx={{ margin: '20px' }}
                        value={valide}
                        onChange={(e) =>setValide(e.target.value)}
                        className='text-demande-annulation'
                        placeholder='validation'
                    />

                    <TextField
                        type='text'
                        sx={{ margin: '20px' }}
                        value={motif}
                        multiline
                        rows={3}
                        onChange={(e) =>setMotif(e.target.value)}
                        className='text-demande-annulation'
                        placeholder='Rédiger votre motif et fêtes-vous clairement'
                    />
                 
                    <TextField
                        type='date'
                        sx={{ margin: '20px' }}
                        value={dateDemande}
                        onChange={(e) =>setDateDemande(e.target.value)}
                        className='text-demande-annulation'
                        size='small'
                    />

                    <button className='btn btn-success text-demande-annulation' id='btn-annuler' style={{ margin: '20px' }}>ENVOYER LA DEMANDE</button>
                    
                </div>
                 </Form>
                <span style={{margin: '20px'}}>{msg}</span>
                <span style={{margin: '20px'}}>{msg5}</span>
            </div>
        </div>
    )
}

export default DemandeAnnulation