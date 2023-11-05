import React, { useEffect, useState } from 'react'
import Menu from '../../Menu/Menu'
import '../Vols/Vol.css'
import { Link, useParams } from 'react-router-dom'
import {Form } from 'react-bootstrap'
import axios from 'axios';
function EditVol() {
    const [donneEditVol, setDonneEditVol] = useState([]);
    const [avionIdEdit, setAvionIdEdit] = useState(0);
    const [numeroVolEdit, setNumVol] = useState("");
    const [dateDepartEdit, setDateDepart] = useState("");
    const [heureDepartEdit, setHeureDepartEdit] = useState("");
    const [lieuDepartEdit, setLieurDepartEdit] = useState("");
    const [lieuArriveeEdit, setLieuArriveeEdit] = useState("");
    const [capaciteEdit, setCapaciteEdit] = useState("");
    const [msg, setMsg] = useState("");

    const { Id } = useParams();

    useEffect(() => {
        AfficherEditVol();
    }, [])
    const AfficherEditVol = async () => {
        await axios.get(`http://localhost:5077/api/Vol/edit-vol/${Id}`).then(({ data }) => {
            setDonneEditVol(data)
            data.map((item) => {
                console.log("Données de l'API :", item);
                setNumVol(item.numeroVol);
                setDateDepart(item.dateDepart);
                setHeureDepartEdit(item.heureDepart);
                setLieurDepartEdit(item.lieuDepart);
                setLieuArriveeEdit(item.lieuArrivee);
                setCapaciteEdit(item.capaciteMax);
            })
        })
    }

    const ModifierVol =async (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("avionid", avionIdEdit);
        formData.append("numeroVol", numeroVolEdit);
        formData.append("dateDepart", dateDepartEdit.split('T')[0]);
        formData.append("heureDepart", heureDepartEdit);
        formData.append("capaciteMax", capaciteEdit);
        formData.append("lieuDepart", lieuDepartEdit);
        formData.append("lieuArrivee", lieuArriveeEdit);
        await axios.post(`http://localhost:5077/api/Vol/modification-vol/${Id}`,formData,
        { headers: { 'Content-Type': 'application/json' }, }
        ).then(({data}) =>{
            console.log(data)
            const message = (<label className='text-success'>{data}</label>);
            setMsg(message);
        })
    }
    //   console.log("numéro : ",numeroVolEdit);
    return (
        <div>
            <Menu />
           
            <div className='edit-vol'>
           
            <Form onSubmit={ModifierVol} className='form-vol'>
            <div className='edit-vol-1'>
            <span>{msg}</span>
                    <input type='text' className='form-control' value={numeroVolEdit}
                        onChange={(e) => setNumVol(e.target.value)}
                    />
                    <input type='date' className='form-control' value={dateDepartEdit.split('T')[0]}
                        onChange={(e) => setDateDepart(e.target.value)} autoComplete='off'
                    />
                    <input type='time' className='form-control' value={heureDepartEdit}
                        onChange={(e) => setHeureDepartEdit(e.target.value)} autoComplete='off'
                    />
                    <input type='text' className='form-control' value={lieuDepartEdit}
                        onChange={(e) => setLieurDepartEdit(e.target.value)} autoComplete='off'
                    />
                    <input type='text' className='form-control' value={lieuArriveeEdit}
                        onChange={(e) => setLieuArriveeEdit(e.target.value)} autoComplete='off'
                    />
                    <input type='number' className='form-control' value={capaciteEdit}
                        onChange={(e) => setCapaciteEdit(e.target.value)}  autoComplete='off'
                    />
                </div>        
                <div className='edit-vol-2'>
                    <button className='btn btn-primary grow' onClick={() => AfficherEditVol()}>ENREGISTRER LA MODIFICATION</button>
                    <Link to={'/vols'} className='btn btn-danger grow'>RETOUR A LA LISTE</Link>
                </div>
             </Form>
            </div>
        </div>
    )
}

export default EditVol