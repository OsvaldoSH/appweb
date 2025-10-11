const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Importamos la conexion

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar la conexion
app.get('/api/vacio', (req, res) =>{
    db.query('SELECT * FROM vacio', (err, results) => {
        if (err) {
            console.error('Error en la consulta: ', err);
            res.status(500).json({ error: 'Error al obtener datos'});
            return;
        }
        res.json(results);
    });
});

// Puerto del servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http:/localhost:${PORT}`);
});
