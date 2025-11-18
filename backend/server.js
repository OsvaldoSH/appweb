const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Importamos la conexion

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/rutas/tarjetas', (req, res) => {
    const query =`
        SELECT
            r.id,
            r.nombre_ruta as nombre,
            r.vehiculo,
            e.nombre as encargado,
            r.fecha_creacion as fecha,
            COALESCE((
                SELECT SUM(rd.cantidad)
                FROM recepcion_detalle rd
                JOIN recepcion rec ON rd.recepcion_id = rec.id
                WHERE rec.ruta_id = r.id    
            ), 0) as saldo
        FROM ruta r
        JOIN empleado e ON r.empleado_id = e.id
        WHERE r.estado = 'activa'
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta de tarjetas:', err);
            return res.status(500).json({error: 'Error en el servidor' });
        }

        console.log('Tarjetas enviadas:', results.length);
        res.json(results);
    });
});

app.get('/api/empleados', (req, res) => {
    const query =`
    SELECT
        e.id,
        e.nombre,
        e.apellido,
        e.edad,
        e.apodo,
        p.nombre_puesto as puesto,
        e.fecha_ingreso,
        e.estado
    FROM empleado e
    JOIN puesto p ON e.puesto_id = p.id
    WHERE e.estado = 'activo'    
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta de empleados:', err);
            return res.status(500).json({error: 'Error del servidor'});
        }
        res.json(results);
    });
});

app.get('/api/puestos', (req, res) => {
    db.query('SELECT * FROM puesto', (err, results) => {
        if (err) return res.status(500).json({error:err});
        res.json(results);
    });
});

app.post('/api/empleados', (req, res) => {
    const {nombre, apellido, edad, apodo, puesto_id, fecha_ingreso } = req.body;

    const query = `
        INSERT INTO empleado (nombre, apellido, edad, apodo, puesto_id, fecha_ingreso, estado)
        VALUES (?,?,?,?,?,?, 'activo')
    `;

    db.query(query, [nombre, apellido, edad, apodo, puesto_id, fecha_ingreso], (err, results) => {
        if (err) {
            console.error('Error insertando empleado:', err);
            return res.status(500).json({error: 'Error en el servidor'});
        }
        res.json({ success: true, id: results.insertId});
    });
});

app.get('/api/empleados/comodatos', (req, res) => {
    const query = `
        SELECT
            e.id,
            e.nombre,
            e.apellido,
            e.puesto_id
        FROM empleado e
        WHERE e.estado = 'activo'
        ORDER BY e.nombre
    `;

    db.query(query,(err, results) => {
        if (err) {
            console.error('Error en la consulta de empledos para comodatos:', err);
            return res.status(500).json({error: 'Error en el servidor'});
        }
        res.json(results);
    });
});

app.get('/api/clientes/clave/:clave', (req, res) => {
    const clave = req.params.clave;

    const query = `
        SELECT 
            c.*,
            r.nombre_ruta,
            e.nombre as vendedor_nombre,
            e.apellido as vendedor_apellido,
            e.id as vendedor_id
        FROM cliente c
        JOIN ruta r ON c.ruta_id = r.id
        JOIN empleado e ON r.empleado_id = e.id
        WHERE c.clave_sive = ? AND c.estado = 'activo'
    `;

    db.query(query, [clave],(err, results) => {
        if (err) {
            console.error('Error buescando el cliente:',err);
            return res.status(500).json({error: 'Error del servidor'});
        }

        if (results.length === 0) {
            return res.status(404).json({error: 'Cliente no encontrado'});
        }

        const cliente = results[0];

        cliente.vendedor_id = cliente.vendedor_id;

        res.json(cliente);
    });
});

// GET /api/enfriadores/serie:serie - Buscar enfriador por numero de serie
app.get('/api/enfriadores/serie/:serie', (req, res) => {
    const serie = req.params.serie;

    const query = `
        SELECT *
        FROM enfriador
        WHERE numero_serie = ? AND estado = 'activo'    
    `;

    db.query(query, [serie], (err,results) => {
        if (err) {
            console.error('Error buscando enfriador:', err);
            return res.status(500).json({error: 'Error en el servidor'});
        }

        if (results.length === 0) {
            return res.status(404).json({error: 'Enfriador no encontrado'});
        }

        res.json(results[0]);
    });
});

//POST /api/comodatos - Crear nuevo comodato
app.post('/api/comodatos', (req, res) => {
    const {
        cliente_id,
        enfriador_id,
        comentario,
        elaborado_por_id,
        autorizado_por_id,
        vendedor_id
    } = req.body;

    //Generar folio automatico 
    const foilio = 'CMD-' + Date.now();
    
    const query = `
        INSERT INTO comodato (
            folio, cliente_id, enfriador_id,comentario,
            elaborado_por_id, autorizado_por_id, vendedor_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query,[
        foilio, cliente_id, enfriador_id, comentario,
        elaborado_por_id, autorizado_por_id, vendedor_id
    ], (err, results) => {
        if (err) {
            console.error("Error creando comdato:", err);
            return res.status(500).json({error: 'Error del servidor'});
        }

        res.json ({
            success: true,
            id: results.insertId,
            folio: folio
        });
    });
});

// Puerto del servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http:/localhost:${PORT}`);
});
