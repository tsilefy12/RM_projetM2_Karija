import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login/Login';
import Inscription from './Pages/Page_Inscription/Inscription';
import Avion from './Pages/Avion/Avion';
import Tarification from './Pages/Tarification/Tarification';
import Reservation from './Pages/Reservation/Reservation';
import Vente from './Pages/VenteBillets/Vente';
import Tableau from './Pages/TableauDeBord/Tableau';
import Vols from './Pages/Vols/Vols';
import Sieges from './Pages/Sieages/Sieges';
import Menu from './Menu/Menu';
import EditVol from './Pages/Vols/EditVol';
import MenuPassager from './Passagers/MenuPassager/MenuPassager';
import Achat from './Passagers/Achat/Achat';
import ReservationPassager from './Passagers/reservation/ReservationPassager';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path={'/'} element={<Login />} />
          <Route path='/inscription' element={<Inscription />} />
          <Route path='/avion' element={<Avion />} />
          <Route path={'/menu'} element={<Menu />} />
          <Route path='/tarification' element={<Tarification />} />
          <Route path='/reservation' element={<Reservation />} />
          <Route path='/venteBillet' element={<Vente />} />
          <Route path='/tableauDeBord' element={<Tableau />} />
          <Route path='/vols' element={<Vols />} />
          <Route path='/api/Vol/edit-vol/:Id' element={ <EditVol/>} />
          <Route path='sieges' element={<Sieges />} />
          <Route path='/MenuPassager' element={<MenuPassager/>} />
          <Route path='/reservation-passager' element={<ReservationPassager/>}/>
          <Route path='/Achat-billet' element={<Achat/>} />
        </Routes>
      </Router>
    </>
  );
}


export default App;
