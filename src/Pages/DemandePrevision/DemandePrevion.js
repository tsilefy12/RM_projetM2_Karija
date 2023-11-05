import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import '../DemandePrevision/DemandePrevision.css'
import { Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import * as AiIcons from "react-icons/ai"
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Form } from 'react-bootstrap'

function DemandePrevion() {
    const [open, setOpen] = React.useState(false);
    const [openModalMessage, setOpenModalMessage] = React.useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [a, setA] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [recherche, setRecherche] = useState("");
    const [donnePrevue, setDonnePrevue] = useState([]);
    const [id, setId] = useState("");
    const [nompass, setNompass] = useState("");
    const [mailaka, setMailaka] = useState("");
    const [phone, setPhone] = useState("");
    const [demandePre, setDemandePre] = useState("");
    const [commentaire, setCommentaire] = useState("");
    const [datepre, setDatePre] = useState("");
    const [affiche, setAffiche] = useState("");
    const [nombre, setNombre] = useState("");
    const [avis, setAvis] = useState("");
    const [message, setMessage] = useState("");
    useEffect(() => {
        verificationRechercher();
    })
    const affihcerDonnePrevue = async () => {
        try {
            const response = await axios.get(`http://localhost:5077/api/DemandePrevue`);
            const data = response.data;
            setDonnePrevue(data);
            setNombre(response.data.length)
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    }
    const RechercherDemande = async () => {
        await axios.get(`http://localhost:5077/api/DemandePrevue/rechercher-demande-prevision?recherche=${recherche}`).then(({ data }) => {
            if (data == 0) {
                setDonnePrevue(data)
                setNombre(data.length)
            } else {
                setDonnePrevue(data);
                setNombre(data.length)
            }
        })
    }
    const supprimerDeamande = async (idpass) => {
        if (idpass == "") {
            console.log("Donnée non disponible")
        } else {
            await axios.delete(`http://localhost:5077/api/DemandePrevue/supprimer-demande/${idpass}`).then(({ data }) => {
                setOpenModalMessage(true);
                const msg3 = (<label className='text-success'>{data}</label>);
                setMessage(msg3);
            })
            setOpenDialog(false);
            affihcerDonnePrevue();
        }

    }
    const editDemande = async (editId) => {
        await axios.get(`http://localhost:5077/api/DemandePrevue/edit-demande-prevision/${editId}`).then(({ data }) => {
            setAvis(data[0].commentaire);
        })
        handleOpen();
        console.log("commentaire :", avis)
        setId(editId);

    }

    const ModificationDemande = async (e) => {
        e.preventDefault();

        console.log("id :", id);
        const formData = new FormData();
        formData.append("idPrevision", 0);
        formData.append("idPassager", 0);
        formData.append("demandePrevue", "string");
        formData.append("datePrevue", "2023-10-23T11:25:27.969Z");
        formData.append("commentaire", avis);

        await axios.post(`http://localhost:5077/api/DemandePrevue/modification-demande-prevision/${id}`,
            formData, { headers: { 'Content-Type': 'application/json' } }).then(({ data }) => {
                setOpenModalMessage(true);
                const msg4 = (<label className='text-success'>{data}</label>);
                setMessage(msg4);
            })
        affihcerDonnePrevue();
        handleClose();
    }
    const verificationRechercher = () => {
        if (recherche == "") {
            affihcerDonnePrevue();
        } else {
            RechercherDemande();
        }
    }
    const handleClearRecherche = () => {

        setRecherche("");
    }
    const fermerModaleMessage = () => setOpenModalMessage(false);
    
    const test = (b) =>{
        setOpenDialog(true);
        setA(b);
    }
    const Annuler = () =>{
        setOpenDialog(false);
        affihcerDonnePrevue();
    }
    return (
        <div className='menu-demande-prevision'>
            <Menu />
            <div className='demandePrevision'>
                <header className='headerPrevision text-info'>
                    LISTE DES TOUTES LES DEMANDES DE PREVISION
                </header>
                <div className='card'>
                    <div className='flex-box card-header prevu' style={{ width: '100%' }}>
                        <label style={{ margin: '10px', fontSize: '1.3em' }} className='text-info'>Effectif des passagers : {nombre}</label>
                        <TextField
                            type='text'
                            placeholder='rechercher...'
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            sx={{ margin: '10px', width: '60%' }}
                            id='inpt-recherche-prevision'
                            InputProps={
                                {
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            {recherche && (
                                                <ClearIcon onClick={handleClearRecherche} style={{ cursor: 'pointer' }} />
                                            )}
                                            <AiIcons.AiOutlineSearch width={20} height={20}></AiIcons.AiOutlineSearch>
                                        </InputAdornment>
                                    )
                                }
                            }
                        />
                    </div>
                    <div className='tableau-prevision card-body'>
                        <table className='table' style={{ margin: '10px', width: '98%' }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NOM</th>
                                    <th>MAIL</th>
                                    <th>TELEPHONE</th>
                                    <th>DATE</th>
                                    <th>DEMANDE</th>
                                    <th>DECISION</th>
                                    <th>OPERATION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donnePrevue.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.demande.idPrevision}</td>
                                        <td>{item.passager.nomPassager}</td>
                                        <td>{item.passager.email}</td>
                                        <td>{item.passager.telephone}</td>
                                        <td>{(item.demande.datePrevue).split('T')[0]}</td>
                                        <td>{item.demande.demandePrevue}</td>
                                        <td>{item.demande.commentaire}</td>
                                        <td className='flex'>
                                            <AiIcons.AiFillEdit color='blue' onClick={() => editDemande(item.demande.idPrevision)}
                                                style={{ cursor: 'pointer', margin: '5px' }} />
                                            <AiIcons.AiFillDelete color='red' onClick={() => test(item.demande.idPrevision)}
                                                style={{ cursor: 'pointer', margin: '5px' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Dialog
                            open={openDialog}
                            disablePortal={true}
                            sx={dialog}
                        >
                            <DialogTitle boxSizing={200} sx={{color: 'red', textAlign: 'left', marginTop: '-6%'}}>Information</DialogTitle>
                            <DialogContent>
                            Vous êtes sûre <AiIcons.AiFillQuestionCircle size={50}/>
                            </DialogContent>
                            <DialogActions sx={{justifyContent: 'space-evenly'}} className='flex'>
                                <button onClick={() =>supprimerDeamande(a)} className='btn btn-primary'>Ok</button>
                                <button onClick={() =>Annuler()} className='btn btn-secondary'>Non</button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <Modal
                        open={openModalMessage}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={styleMessage}>
                            <div className='flex'>
                                <label style={{fontSize: '1.3em'}}>{message}</label>
                                <AiIcons.AiOutlineClose onClick={() => fermerModaleMessage()}
                                    style={{ cursor: 'pointer', marginTop: '-12%', marginRight: '-10%' }} size={30} />
                            </div>
                        </Box>
                    </Modal>
                </div>
                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Form onSubmit={ModificationDemande}>
                            <div>
                                <div>
                                    <header>
                                        <h2 className='text text-center text-info' style={{ marginBottom: '6px' }}>MODIFICATION</h2>
                                    </header>
                                </div>
                                <div className='edite-avion-formulaire'>
                                    <label className='label-avion'>Avix du responsable</label>
                                    <input
                                        type='text'
                                        min={0}
                                        className='form-control'
                                        autoComplete='off'
                                        value={avis}
                                        onChange={(e) => setAvis(e.target.value)}
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
const styleMessage = {
    position: 'relative',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200,
    height: 'auto',
    bgcolor: 'lightblue',
    boxShadow: 24,
    pt: 2,
    px: 2,
    pb: 3,
    border: 'none',
}
const dialog = {
  top: -150,
}

export default DemandePrevion