import React from 'react';
import Header from './components/Header/Header';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="placeholder-content">
          <h1>Distribuidora de cerveza Zacapoaxtla</h1>
          <p>El header esta funcionando correctamente</p>
        </div>
      </main>
    </div>
  );
}

export default App
