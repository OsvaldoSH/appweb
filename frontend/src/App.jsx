import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import ControlVacio from './pages/ControlVacio/ControlVacio';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Header />
        <main className='main-content'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/control-vacio" element={<ControlVacio />}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
};
export default App
