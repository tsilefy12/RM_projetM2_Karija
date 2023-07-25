import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login/Login';
function App() {
  return (
   <>
    <Router>
      <Routes>
        <Route path={'/'} element={<Login/>} />
      </Routes>
    </Router>
   </>
  );
}


export default App;
