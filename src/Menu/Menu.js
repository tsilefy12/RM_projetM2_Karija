import React, { useState } from 'react';
import img from '../images/back_64px.png';
import dash from '../icons/dashboard_layout_48px.png'
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Menu.css';

function Menu() {
  const [open, setOpen] = useState(false);

  const handleImageClick = () => {
    setOpen(!open);
  };

  const Menus = [
    { title: "DASHBOARD", icon: require("../images/images (2).jpg"), path: "/tableaudebord" },
    { title: "AVION", icon: require("../images/airplane_take_off_48px.png"), path: "/Avion" },
    { title: "VOLS", icon: require("../images/paper_plane_48px.png"), path: "/vols" },
    { title: "TARIFICATION", icon: require("../images/Us Dollar Circled_40px.png"), path: "/tarification" },
    { title: "REVENU", icon: require("../images/Money Bag Pounds_40px.png"), path: "" },
    { title: "RESERVATION", icon: require("../images/reception_40px.png"), path: "/reservation" },
    { title: "VENTE DE BILLET", icon: require("../images/movie_ticket_40px.png"), path: "/venteBillet" },
    { title: "PREVISION", icon: require("../images/ask_question_40px.png"), path: "" },
  ]
  const containerWidth = open ? '210px' : '80px';
  const containerWidthMenu = open ? '210px' : '80px';
  const top = open ? '300px' : '300px';
  const left = open ? '198px' : '70px';
  const topmenu = open ? '-300px' : '-300px';
  const afficher = !open ? 'none' : 'block';
  const topMenus = open ? '30px' : '50px';
  const magreLi = open ? '16px' : '20px';
  const margeleft = !open ? '-17px': "-17px";
  return (
      <div className='flex' expand="lg">
        <div className={`toggle-menu ${open ? 'show' : ''}`}
          style={{
            width: containerWidth,
            position: 'fixed',
            height: '100.5vh',
            backgroundColor: '#8D0A22',
            transition: 'width 0.5s',
            left: 0, 
            zIndex: 1
          }}
        >
          <Image
            src={img}
            style={{
              position: 'relative',
              marginTop: top,
              marginLeft: left,
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              transition: 'margin-left 0.5s',
              zIndex: 1
            }}
            onClick={handleImageClick}
            className={`${!open && 'rotate-180'}`}
          />
          <div style={{
            marginTop: topmenu, height: '90vh',
            color: 'white', display: 'flex', flexDirection: 'column'
          }}>
           <header className='header' style={{width:"auto", height:"120px", 
           border:"1px solid white", marginTop: "-20px"}}>
             Passager connecté
           </header>
              <ul style={{
                marginTop: topMenus,borderTop: '4px solid #07af6f',
                width: containerWidthMenu, transition: 'width 0.5s',
                marginTop: "0",
              }}>
                {Menus.map((items, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'row', marginLeft : margeleft, transition: 'margin-left 0.5s' }}>
                    <Link to={items.path} className='flex' style={{ textDecoration: 'none', color: 'white' }}>
                      <img src={items.icon} width={35} height={35} style={{borderRadius: "50%", backgroundColor: "#8D041D", marginTop:"10px"}}/>
                      <li className='li' style={{
                        display: afficher, transition: 'display: none 0.5s',
                        textDecoration: 'none', marginTop: magreLi, marginLeft: "10px"
                      }}>{items.title}</li>
                    </Link>
                  </div>
                ))}
              </ul>
             
          </div>  
        </div>
      </div>
  );
}
export default Menu;
