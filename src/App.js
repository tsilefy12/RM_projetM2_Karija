import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from './Menu/Menu';
import Dashboard from './Pages/Dashboard/Dashboard';
import Itineraire from './Pages/Itineraires/Itineraire';
import Avion from './Pages/Avion/Avion';
import Vol from './Pages/Vol/Vol';
import Reservation from './Pages/Reservation/Reservation';
import Tarification from './Pages/Tarification/Tarification';
import PaiementBillet from './Pages/PaiementBillet/PaiementBillet';
import Demande from './Pages/Demande/Demande';
import Revenu from './Pages/Revenu/Revenu';
import tachyons from 'tachyons'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Menu/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/itineraires' element={<Itineraire/>} />
          <Route path='/avion' element={<Avion/>} />
          <Route path='/vol' element={<Vol/>} />
          <Route path='/reservation' element={<Reservation/>} />
          <Route path='/tarification' element={<Tarification/>} />
          <Route path='/paiement-billet' element={<PaiementBillet/>} />
          <Route path='/demande' element={<Demande/>} />
          <Route path='/revenu' element={<Revenu/>} />
        </Routes>
      </Router>
    </>
  );
}


export default App;
