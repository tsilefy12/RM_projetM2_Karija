import React, { useEffect, useState } from 'react'
import '../reservation/ReservationPassager.css'
import { Box, FormLabel, InputAdornment, Modal, TextField } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import * as AiIcons from "react-icons/ai"
import MenuPassager from '../MenuPassager/MenuPassager';
import { Form, Image } from 'react-bootstrap';
import logoImage from '../../images/Air-Mad.jpeg'
import photo from '../../images/images (4).jpg'
import { name } from '../Name';
import { useNavigate } from 'react-router';


function ReservationPassager() {
    // const [donneResultat, setDonneResultat] = useState([]);
    const navigate = useNavigate();
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
    const [messageValidation, setMessageValidation] = useState("");
    const [donneId, setDonneId] = useState([]);

    const [num, setNum] = useState("");
    const [Pid, setPid] = useState("");
    const [Tid, setTid] = useState("Selectionner");
    const [prix, setPrix] = useState("");
    const [dateresa, setDateResa] = useState("");
    const [typeTarification, setTypeTarification] = useState("");
    const [longueur, setLongueur] = useState([]);
    const [nombre, setNombre] = useState(0);
    const [openModal, setOpenModal] = useState(false)



    useEffect(() => {
        resultatAfficher();
        verify();
        selectId();
        selectTypePrix();
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
        if (lieuDep === "") {
            setNumAvion(mess);
            setNumVol(mess);
            setNum("");
            setDateDep(mess);
            setHeureDep(mess);
            setCapacite(mess);
            setLieuD(mess);
            setLieuA(mess);
            setNombre(0);
        } else {
            await axios.get(`http://localhost:5077/api/Vol/recherche?recherche=${lieuDep}`).then(({ data }) => {
                if (data.length == 0) {
                    setNumAvion(mess);
                    setNumVol(mess);
                    setNum("");
                    setDateDep(mess);
                    setHeureDep(mess);
                    setCapacite(mess);
                    setLieuD(mess);
                    setLieuA(mess);
                    setNombre(0);
                } else {
                    setNombre(data.length);
                    data.map((item) => {
                        setNumAvion(item.avionId);
                        setNumVol(item.id);
                        setNum(item.id);
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
        (lieuDep == "") ? setNum("") : setNum(numvol);
    }

    const reserverVol = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("volId", num);
        formData.append("passagerId", Pid);
        formData.append("tarificationId", Tid);
        formData.append("libelle", typeTarification);
        formData.append("dateReservation", dateresa);
        if (num == "" || dateresa == "" || Pid == "") {
            const msg1 = (<label className='text text-danger'>Les chmaps sont obliagtoires</label>);
            setMessageValidation(msg1);
        }
        else if (Tid == "Selectionner" || typeTarification == "") {
            const msg1 = (<label className='text text-danger'>Veuillez selectionner un tarif</label>);
            setMessageValidation(msg1);
        } else {
            await axios.post(`http://localhost:5077/api/Reservation/reserver-vol`,
                formData, { headers: { 'Content-Type': 'application/json' } }).then(({ data }) => {
                    console.log(data);
                    setMessageValidation(<label className='text-success'>{data}</label>)
                })
        }
    }

    const selectId = async () => {
        await axios.get(`http://localhost:5077/api/Tarif/select-id`).then(({ data }) => {
            setDonneId(data);
        })
    }

    const selectTypePrix = async () => {
        if (Tid == "Selectionner") {
            setTypeTarification("");
            setPrix("");
        } else {
            await axios.get(`http://localhost:5077/api/Tarif/select-tarif?IdT=${Tid}`).then(({ data }) => {
                if (data.length == 0 || Tid == "Selectionner") {
                    setTypeTarification("");
                    setPrix("");
                } else {
                    data.map((i) => {
                        setTypeTarification(i.typeTarif)
                        setPrix(i.prix)
                    })
                }
            })
        }
    }

    const afficherTout = async () => {
        if (lieuDep === "") {

        } else {
            await axios.get(`http://localhost:5077/api/Vol/recherche?recherche=${lieuDep}`).then(({ data }) => {
                setLongueur(data)
            }).catch(error => {
                console.log("erreur :", error);
            });
            setOpenModal(true);
        }
        console.log("longueur :", longueur)
    }

    return (
       <>
        {
            (name.length == 0) ? navigate('/') : (
                <div className='reservation-passager'>
            <MenuPassager />
            <div className='passager-resa'>
                <div className='afficher-rechercher-vol'>
                    <span onClick={() => afficherTout()} style={{ cursor: 'pointer', fontSize: '1.5em' }}
                        className='text-info'>Afficher tout</span>
                    <span style={{ marginTop: '4%' }}>Résultat trouvé : {nombre}</span>
                    <header className='header-passager'>
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
                                            <AiIcons.AiOutlineSearch></AiIcons.AiOutlineSearch>
                                        </InputAdornment>
                                    ),
                                }
                            }
                            placeholder='rechercher votre vol'
                            sx={{ marginTop: '12%' }}
                        />
                    </header>
                </div>
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
                        <div className='res-3'>
                            <Image src={logoImage} size='cover' />
                        </div>
                    </div>
                    <div className='reserver-vol'>

                        <span style={{ marginBottom: '-4%', marginTop: '2%' }}>{messageValidation}</span>
                        <Form onSubmit={reserverVol}>
                            <div className='formulaire-resa-personne'>
                                <TextField
                                    type='number'
                                    placeholder='Id vol'
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
                                <select className='form-control reserv' style={{
                                    width: "200px", height: "5.8vh",
                                    marginRight: "4px", backgroundColor: 'rgb(238, 238, 240)'
                                }}
                                    onChange={(e) => setTid(e.target.value)}>
                                    <option>Selectionner</option>
                                    {
                                        donneId.length > 0 && (
                                            donneId.map((i) => (
                                                <option value={i.id} onClick={() => selectTypePrix()}>{i.id}</option>
                                            ))
                                        )
                                    }
                                </select>
                                <TextField
                                    type='text'
                                    placeholder='type tarif'
                                    value={typeTarification}
                                    onChange={(e) => setTypeTarification(e.target.value)}
                                    aria-readonly
                                    className='reserv'
                                />
                                <TextField
                                    type='number'
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
                            <button className='btn btn-success grow' id='btn-reserver'>RESERVER</button>
                        </Form>
                    </div>
                </div>
            </div>
            <Modal
                open={openModal}
                disablePortal={true}
            >
               
                <Box sx={style}>
                <AiIcons.AiOutlineClose size={23} style={{ float: 'right', cursor: 'pointer', 
                marginTop: '-16px', marginRight: '-15px', marginLeft: '6px' }}
                    onClick={() => setOpenModal(false)} />
                    <div style={{height: '35vh', overflow: 'auto'}}>
                    {
                        longueur.length > 0 && (
                            longueur.map((e, index) => (
                                <div className='imageInfovol' key={index}>
                                    <div className='tout-vol-itineraire'>
                                        <label>Numéro vol : {e.numeroVol}</label>
                                        <label>Date départ : {e.dateDepart.split('T')[0]}</label>
                                        <label>Heure départ : {e.heureDepart}</label>
                                    </div>
                                    <div className='image-vol'>
                                        <Image src={photo} size={'cover'}></Image>
                                    </div>
                                </div>


                            ))
                        )
                    }
                    </div>
                    
                </Box>
            </Modal>
        </div>
            )
        }
       </>
    )
}
const style = {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 240,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 2,
    pb: 3,
    border: 'none',

};
export default ReservationPassager