import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../MenuPassager/MenuPassager.css'
import '../reservation/ReservationPassager.css'
import photo from '../../icons/IMG_20210322_075139.jpg'
import ReservationPassager from '../reservation/ReservationPassager';

function MenuPassager() {
  return (
    <>
      <div className='tout-menu-passager'>
        <div>
          <Navbar expand="lg" className="flex-column w-15" id='nav-bar'>
            <Container>
              <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: '#FFFFFF' }} />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="flex-column">
                  <Image src={photo} width={180} height={150} style={{ margin: '35px', cursor: 'pointer' }} className='img grow'></Image>
                  <div className='link-menupassager'>
                    <Link to={'/reservation-passager'} className='menu-item-passager' id='resa'>RESERVATION</Link>
                    <Link  to={'/Achat-billet'} className='menu-item-passager'>ACHAT DU BILLET</Link>
                    <Link className='menu-item-passager'>DEMANDE D'ANNULATION</Link>
                    <Link className='menu-item-passager'>DEMANDE DE REMBOURSEMENT</Link>
                    <Link className='menu-item-passager'>DEMANDE DE LA PREVISION</Link>
                  </div>
                  <div className='footer-menu-pasager'>
                    <Link className='menu-item-passager'>PROFIL</Link>
                    <Link className='menu-item-passager'>CONTACT</Link>
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
        <div className='personne'>
          <span>Message</span>
          <label>Compte</label>
          <button>Deconnexion</button>
        </div>
      </div>

    </>

  );
}

export default MenuPassager;
