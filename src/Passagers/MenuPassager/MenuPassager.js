import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Container, Image } from 'react-bootstrap';
import { Link,useLocation  } from 'react-router-dom';
import '../MenuPassager/MenuPassager.css'
import '../reservation/ReservationPassager.css'
import photo from '../../icons/IMG_20210322_075139.jpg'
import { AiFillAccountBook, AiFillBank, AiFillBook, AiFillCompass, AiFillContacts, AiFillDelete, AiFillProfile } from 'react-icons/ai';

function MenuPassager() {
  const isMenuActive = true; 
  const location = useLocation();

  useEffect(() => {
    const activePage = location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      if (link.href.includes(activePage)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, [location.pathname]);
  return (
    <>
      <div className='tout-menu-passager'>
        <div>
          <Navbar expand="lg" className="flex-column w-15" id='nav-bar'>
            <Container>
              <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: '#FFFFFF' }} />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="flex-column" id='nav'>
                  <Image src={photo} width={150} height={100} style={{ cursor: 'pointer' }} className='img grow' id='sary'></Image>
                  <div className='link-menupassager'>
                    <Link to={'/reservation-passager'} className='menu-item-passager' id='resa'>
                    <AiFillAccountBook size={25} style={{marginTop: '-6px'}}/><label className='link-menu' style={{marginLeft: '4px', 
                    cursor: 'pointer'}}>RESERVATION</label></Link>
                    <Link  to={'/Achat-billet'} className='menu-item-passager'>
                    <AiFillBook style={{marginTop: '-6px'}} size={25}/><label className='link-menu' style={{marginLeft: '4px', 
                    cursor: 'pointer'}}>ACHAT DU BILLET</label></Link>
                    <Link  to={'/demande-annulation'} className='menu-item-passager'>
                    <AiFillDelete style={{marginTop: '-6px'}} size={25}/><label className='link-menu' style={{marginLeft: '4px', 
                    cursor: 'pointer'}}>ANNULATION</label></Link>
                    <Link to={'/remboursement'} className='menu-item-passager'>
                    <AiFillBank style={{marginTop: '-6px'}} size={25}/><label className='link-menu' style={{marginLeft: '4px', 
                    cursor: 'pointer'}}>REMBOURSEMENT</label></Link>
                    <Link to={'/prevision'} className='menu-item-passager'>
                    <AiFillCompass style={{marginTop: '-6px'}} size={25}/><label className='link-menu' style={{marginLeft: '4px', 
                    cursor: 'pointer'}}>PREVISION</label></Link>
                    
                  </div>
                  <div className='footer-menu-pasager'>
                    <Link to={'/profil'} className='menu-item-passager'>
                    <AiFillProfile style={{marginTop: '-6px'}} size={25}/><label className='link-menu'style={{marginLeft: '4px', 
                    cursor: 'pointer'}}>PROFIL</label>
                    </Link>
                    <Link to={'/'} className='menu-item-passager'>
                      <AiFillContacts style={{marginTop: '-6px'}} size={25}/><label className='link-menu'style={{marginLeft: '4px', 
                      cursor: 'pointer'}}>CONTACT</label>
                    </Link>
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
        <div className='personne'>
          <span style={{cursor: 'pointer'}}>Message</span>
          <span style={{cursor: 'pointer'}}>Compte</span>
          <Link to={'/'} style={{cursor: 'pointer', textDecoration: 'none'}}>Deconnexion</Link>
        </div>
      </div>
    </>

  );
}
export default MenuPassager;