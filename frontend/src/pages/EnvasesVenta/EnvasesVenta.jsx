// frontend/src/pages/EnvasesVenta/EnvasesVenta.jsx
import React, { useState, useEffect } from 'react';
import './EnvasesVenta.css';
import { envasesService } from '../../services/envasesService';

const EnvasesVenta = () => {
  { /*const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);*/}
  const [fecha, setFecha] = useState('2024-01-15');
  const [resumen, setResumen] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar resumen al cambiar fecha
  useEffect(() => {
    cargarResumen();
  }, [fecha]);

  const cargarResumen = async () => {
    setCargando(true);
    try {
      const data = await envasesService.getResumenRutas(fecha);
      setResumen(data);
    } catch (error) {
      console.error('Error cargando resumen:', error);
    } finally {
      setCargando(false);
    }
  };

    return (
        <div className="envases-venta">
            <h1>📦 Control de Envases</h1>
            
            <div className="filtro-fecha">
            <label>Fecha: </label>
            <input 
                type="date" 
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
            />
            </div>

            {/* DEBUG: Mostrar estado */}
            <div style={{background: '#eee', padding: '10px', margin: '10px 0'}}>
            <p>📊 Estado: {cargando ? 'Cargando...' : 'Listo'}</p>
            <p>📅 Fecha seleccionada: {fecha}</p>
            <p>🎯 Items en resumen: {resumen.length}</p>
            <pre>{JSON.stringify(resumen, null, 2)}</pre>
            </div>

            {/* Tarjetas de rutas */}
            <div className="tarjetas-rutas">
            {resumen.length === 0 ? (
                <p>No hay datos para esta fecha</p>
            ) : (
                resumen.map((item, index) => (
                <div key={index} className="tarjeta-ruta">
                    <h3>Ruta {item.ruta_id} - {item.tipo_envase}</h3>
                    <p>Diferencia: {item.diferencia}</p>
                </div>
                ))
            )}
            </div>

            <button className="btn-agregar">
            ➕ Agregar Recepción
            </button>
        </div>
    );
};

export default EnvasesVenta;