import React, { useEffect, useState } from 'react'
import '../reservation/ReservationPassager.css'
import { FormLabel, InputAdornment, TextField, useStepContext } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import * as AiIcons from "react-icons/ai"
import MenuPassager from '../MenuPassager/MenuPassager';
import { Form } from 'react-bootstrap';

function ReservationPassager() {
    // const [donneResultat, setDonneResultat] = useState([]);
    const [numavion, setNumAvion] = useState("");
    const [numvol, setNumVol] = useState("'");
    const [datedep, setDateDep] = useState("");
    const [heuredep, setHeureDep] = useState("");
    const [capacite, setCapacite] = useState("");
    const [lieuD, setLieuD] = useState("");
    const [lieuA, setLieuA] = useState("'");
    const [lieuDep, setLieuDep] = useState("");
    const [lieuAr, setLieuAr] = useState("");
    const [EmailPassager, setEmailPassager] = useState("");

    const [num, setNum] = useState("");
    const [Pid, setPid] = useState("");
    const [Tid, setTid] = useState("");
    const [prix, setPrix] = useState("");
    const [dateresa, setDateResa] = useState("");
    const [typeTarification, setTypeTarification] = useState("");

    useEffect(() => {
        resultatAfficher();
        verify();
        // afficherReservation();
    })
    const handleClearLieuD = () => {
        setLieuDep("");
    }
    const handleClearLieuA = () => {
        setLieuAr("");
    }
    const handleClearEmail = () => {
        setEmailPassager("");
    }
    const daty = new Date(datedep);
    const date = daty.toLocaleDateString('en-Us');
    const mess = (<label className='text-danger'>champ vide</label>)
    const resultatAfficher = async () => {
        if (lieuDep === "" || lieuAr === "") {
            setNumAvion(mess);
            setNumVol(mess);
            setDateDep(mess);
            setHeureDep(mess);
            setCapacite(mess);
            setLieuD(mess);
            setLieuA(mess);
        } else {
            await axios.get(`http://localhost:5077/api/Vol/recherche?LieuDepart=${lieuDep}&LieuArrivee=${lieuAr}`).then(({ data }) => {
                if (data.length == 0) {
                    setNumAvion(mess);
                    setNumVol(mess);
                    setDateDep(mess);
                    setHeureDep(mess);
                    setCapacite(mess);
                    setLieuD(mess);
                    setLieuA(mess);
                } else {
                    data.map((item) => {
                        setNumAvion(item.avionId);
                        setNumVol(item.id);
                        setDateDep(item.dateDepart);
                        setHeureDep(item.heureDepart);
                        setCapacite(item.capaciteMax);
                        setLieuD(item.lieuDepart);
                        setLieuA(item.lieuArrivee);
                    })

                }
            })
        }
    }
    const verify = () => {
        (lieuDep == "" || lieuAr == "") ? setNum("") : setNum(numvol);
    }

    const reserverVol = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("volId", num);
        formData.append("passagerId", Pid);
        formData.append("tarificationId", Tid);
        formData.append("libelle", typeTarification);
        formData.append("dateReservation", dateresa);
        await axios.post(`http://localhost:5077/api/Reservation/reserver-vol`,
            formData, { headers: { 'Content-Type': 'application/json' } }).then(({ data }) => {
                console.log(data);
            })
    }

    return (
        <div className='reservation-passager'>
            <MenuPassager />
            <div className='passager-resa'>
                <header className='header-passager'>
                    <FormLabel className='inpout-passager'>Lieu de départ</FormLabel>
                    <TextField
                        type='text'
                        value={lieuDep}
                        onChange={(e) => setLieuDep(e.target.value)}
                        autoComplete='off'
                        InputProps={
                            {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {lieuDep && (
                                            <ClearIcon onClick={handleClearLieuD} style={{ cursor: 'pointer' }} />
                                        )}
                                    </InputAdornment>
                                ),
                            }
                        }
                    />
                    <FormLabel className='inpout-passager'>Lieu d'arrivée</FormLabel>
                    <TextField
                        type='text'
                        value={lieuAr}
                        onChange={(e) => setLieuAr(e.target.value)}
                        autoComplete='off'
                        InputProps={
                            {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {lieuAr && (
                                            <ClearIcon onClick={handleClearLieuA} style={{ cursor: 'pointer' }} />
                                        )}
                                    </InputAdornment>
                                ),
                            }
                        }
                    />
                </header>
                <hr></hr>
                <div className='resultat-vol'>
                    <div className='res-vol'>
                        <div className='res-1'>
                            <div className='fromLabSpan'>
                                <FormLabel>Numéro d'avion : </FormLabel>
                                <span style={{ marginLeft: '4px', color: 'green' }}>{numavion}</span>
                            </div>
                            <div className='fromLabSpan'>
                                <FormLabel>Numéro du vol : </FormLabel>
                                <span style={{ marginLeft: '4px', color: 'green' }}>{numvol}</span>
                            </div>
                            <div className='fromLabSpan'>
                                <FormLabel>Date départ : </FormLabel>
                                <span style={{ marginLeft: '4px', color: 'green' }}>{date}</span>
                            </div>
                            <div className='fromLabSpan'>
                                <FormLabel>Heure de départ : </FormLabel>
                                <span style={{ marginLeft: '4px', color: 'green' }}>{heuredep}</span>
                            </div>
                        </div>
                        <div className='res-2'>
                            <div className='fromLabSpan'>
                                <FormLabel>Capacité : </FormLabel>
                                <span style={{ marginLeft: '4px', color: 'green' }}>{capacite}</span>
                            </div>
                            <div className='fromLabSpan'>
                                <FormLabel>Lieu de départ : </FormLabel>
                                <span style={{ marginLeft: '4px', color: 'green' }}>{lieuD}</span>
                            </div>
                            <div className='fromLabSpan'>
                                <FormLabel>Lieu d'arrivée : </FormLabel>
                                <span style={{ marginLeft: '4px', color: 'green' }}>{lieuA}</span>
                            </div>
                        </div>
                    </div>
                    <div className='reserver-vol'>
                        <div className='recherche-personne'>
                            <TextField
                                placeholder='rechercher votre nom par adresse email avant la réservation...'
                                value={EmailPassager}
                                onChange={(e) => setEmailPassager(e.target.value)}
                                InputProps={
                                    {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {EmailPassager && (
                                                    <ClearIcon onClick={handleClearEmail} style={{ cursor: 'pointer' }} />
                                                )}
                                                <AiIcons.AiOutlineSearch width={20} height={20}></AiIcons.AiOutlineSearch>
                                            </InputAdornment>
                                        ),
                                    }
                                }
                                className='input-mail-personne'
                            />
                        </div>
                        <Form onSubmit={reserverVol}>
                            <div className='formulaire-resa-personne'>
                                <TextField
                                    type='text'
                                    placeholder='numéro vol'
                                    value={num}
                                    onChange={(e) => setNum(e.target.value)}
                                    className='reserv'
                                    aria-readonly
                                />
                                <TextField
                                    type='number'
                                    placeholder='numéro passager'
                                    value={Pid}
                                    onChange={(e) => setPid(e.target.value)}
                                    className='reserv'
                                />
                                <TextField
                                    type='number'
                                    placeholder='numéor tarif'
                                    value={Tid}
                                    onChange={(e) => setTid(e.target.value)}
                                    className='reserv'
                                />
                                <TextField
                                    type='text'
                                    placeholder='type tarif'
                                    value={typeTarification}
                                    onChange={(e) => setTypeTarification(e.target.value)}
                                    aria-readonly
                                    className='reserv'
                                />
                                <TextField
                                    type='text'
                                    placeholder='prix'
                                    value={prix}
                                    onChange={(e) => setPrix(e.target.value)}
                                    aria-readonly
                                    className='reserv'
                                />
                                <TextField
                                    type='date'
                                    value={dateresa}
                                    onChange={(e) => setDateResa(e.target.value)}
                                    size='small'
                                    className='reserv'
                                />
                            </div>
                            <button className='btn btn-primary grow' id='btn-reserver'>RESERVER</button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReservationPassager