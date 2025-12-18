import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Empleados from './pages/Empleados/Empleados';
import ControlVacio from './pages/ControlVacio/ControlVacio';
import ContratosComodato from './pages/ContratosComodato/ContratosComodato';
import EnvasesVenta from './pages/EnvasesVenta/EnvasesVenta';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Header />
        <main className='main-content'>
          <Routes>
            <Route path="/" element={<Home />} />
           {/*<Route path="/control-vacio" element={<ControlVacio />}/>*/}
            <Route path="/empleados" element={<Empleados/>}/>
            <Route path="/comodatos" element={<ContratosComodato/>}/>
            <Route path="/envases" element={<EnvasesVenta/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
};
export default App
