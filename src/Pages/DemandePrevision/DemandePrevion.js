import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import '../DemandePrevision/DemandePrevision.css'
import { InputAdornment, TextField } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import * as AiIcons from "react-icons/ai"
import axios from 'axios';

function DemandePrevion() {
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
    const daty = new Date(datepre);
    const datyy = daty.toLocaleDateString('en-Us');
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
            await axios.delete(`http://localhost:5077/api/DemandePrevue/supprimer-demande?IdPassager=${idpass}`).then(({ data }) => {
                console.log("message : ", data);
            })
            affihcerDonnePrevue();
        }

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
                                        <td>{item.demande.idPassager}</td>
                                        <td>{item.passager.nomPassager}</td>
                                        <td>{item.passager.email}</td>
                                        <td>{item.passager.telephone}</td>
                                        <td style={{ display: affiche }}>{item.demande.datePrevue}</td>
                                        <td>{item.demande.demandePrevue}</td>
                                        <td>{item.demande.commentaire}</td>
                                        <td className='flex'>
                                            <AiIcons.AiFillEdit color='blue' display={affiche} />
                                            <AiIcons.AiFillDelete color='red' onClick={() => supprimerDeamande(item.demande.idPassager)}
                                                style={{ cursor: 'pointer' }} display={affiche} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DemandePrevion