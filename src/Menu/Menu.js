import React ,{useEffect} from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Menu.css';
import { Image } from 'react-bootstrap';
import logo from '../images/téléchargement (5).png'
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
function Menu() {
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
    <Navbar className='navbar' data-bs-theme="dark">
      <Navbar.Brand href="#home">
        <Image src={logo} width={200} height={60} style={{color: 'white'}}/>
      </Navbar.Brand>
      <Nav className="me-auto">
        <Link  to={'/dashboard'} className='menu-item'>DASHBOARD</Link>
        <Link  to={'/itineraires'} className='menu-item'>ITINERAIRES</Link>
        <Link  to={'/avion'} className='menu-item'>AVION</Link>
        <Link  to={'/vol'} className='menu-item'>VOL</Link>
        <Link  to={'/reservation'} className='menu-item'>RESERVATION</Link>
        <Link  to={'/tarification'} className='menu-item'>TARIFICATION</Link>
        <Link  to={'/paiement-billet'} className='menu-item'>PAIEMENT BILLET</Link>
        <Link  to={'/demande'} className='menu-item'>DEMANDE</Link>
        <Link  to={'/revenu'} className='menu-item'>REVENU</Link>
      </Nav>
  </Navbar>
  )
}

export default Menu