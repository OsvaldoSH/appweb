const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Importamos la conexion

const app = express();
app.use(cors());
app.use(express.json());

{/*
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
});  */}

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

//Endpoint para sistema de envases.
app.get('/api/envases/movimientos', (rep, res) => {
    const { ruta_id, fecha, limit = 50, offset = 0 } = req.query;

    let query = `SELECT * FROM movimientos_envases WHERE 1=1`;
    const params = [];

    if (ruta_id) {
        query += ' AND ruta_id = ?';
        params.push(parseInt(ruta_id));
    }

    if (fecha) {
        query += ' AND fecha = ?';
        params.push(fecha);
    }

    query += ' ORDER BY fecha DESC, id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error en movimientos envases:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        console.log(`Movimientos envases encontrados: ${results.length}`);
        res.json(results);
    });
});

// POST - Crear ticket (lo que debe de recibir)
app.post('/api/envases/tickets', (req, res) => {
    const {
        fecha,
        ruta_id,
        tipo_envase,
        a_recibir_mega_12pz = 0,
        a_recibir_litro_12pz = 0,
        a_recibir_familiar_12pz = 0,
        a_recibir_media_24pz = 0,
        a_recibir_media_12pz = 0,
        a_recibir_cuarto_24pz = 0,
        a_recibir_otro = 0,
    } = req.body;

    // validaciones
    if (!fecha || !ruta_id || !tipo_envase) {
        return res.status(400).json ({ error: 'Faltan campos requeridos' });
    }

    // Calcular total a recibir
    const total_a_recibir = a_recibir_mega_12pz + a_recibir_litro_12pz + a_recibir_familiar_12pz + 
            a_recibir_media_24pz + a_recibir_media_12pz + a_recibir_cuarto_24pz + a_recibir_otro;

    const query = `
        INSERT INTO tickets_envases
        (fecha, ruta_id, tipo_envase,
        a_recibir_mega_12pz, a_recibir_litro_12pz, a_recibir_familiar_12pz,
        a_recibir_media_24pz, a_recibir_media_12pz, a_recibir_cuarto_24pz,
        a_recibir_otro, total_a_recibir) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        fecha, ruta_id, tipo_envase,
        a_recibir_mega_12pz, a_recibir_litro_12pz, a_recibir_familiar_12pz, a_recibir_media_24pz, 
        a_recibir_media_12pz, a_recibir_cuarto_24pz, a_recibir_otro, total_a_recibir
    ];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error creando ticket envases:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        console.log(`Ticket dreado - ID: ${results.insertId}, Ruta: ${ruta_id}, Tipo: ${tipo_envase}`);

        res.json({
            success: true,
            id: results.insertId,
            total_a_recibir: total_a_recibir
        });
    });
});


// Post crear recepcion (lo que realmente se entrega)
app.post('/api/envases/recepcion', (req, res) => {
    const {
        ticket_id,
        fecha,
        ruta_id,
        tipo_envase,
        recepcion_mega_12pz = 0,
        recepcion_litro_12pz = 0,
        recepcion_familiar_12pz = 0,
        recepcion_media_24pz = 0,
        recepcion_media_12pz = 0,
        recepcion_cuarto_24pz = 0,
        recepcion_otro = 0,
    } = req.body;

    // Validaciones
    if (!ticket_id || !fecha || !ruta_id || !tipo_envase) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Primero obtener los valores "a recibir" deltiket
    const getTicketQuery = 'SELECT * FROM tickets_envases WHERE id = ?';

    db.query(getTicketQuery, [ticket_id], (err, ticketResults) => {
        if (err) {
            console.error('Error obteniendo ticket:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        if (ticketResults.length === 0 ) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }
        const ticket = ticketResults[0];

        // Calcular recepcion y diferencia
        const total_recepcion = recepcion_mega_12pz + recepcion_litro_12pz + recepcion_familiar_12pz +
                                recepcion_media_24pz + recepcion_media_12pz + recepcion_cuarto_24pz + recepcion_otro;
        
        const diferencia_total =total_recepcion - ticket.total_a_recibir;

        const insertQuery = `
        INSERT INTO recepcion_envase 
        (ticket_id, fecha, ruta_id, tipo_envase,
        recepcion_mega_12pz, recepcion_litro_12pz, recepcion_familiar_12pz, recepcion_media_24pz, recepcion_media_12pz, recepcion_cuarto_24pz, recepcion_otro, total_recepcion,
        diferencia_total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)   
        `;

        const params = [
            ticket_id, fecha, ruta_id, tipo_envase,
            recepcion_mega_12pz, recepcion_litro_12pz, recepcion_familiar_12pz, recepcion_media_24pz, recepcion_media_12pz, recepcion_cuarto_24pz, recepcion_otro, total_recepcion,
            diferencia_total
        ];

        db.query(insertQuery, params, (err, results) => {
            if (err) {
                console.error('Error creando recepcion de envases:', err );
                return res.status(500).json({error: 'Error del servidor' });
            }

            console.log(`Recepcion creada - ID: ${results.insertId}, Ticket: ${ticket_id}`);

            res.json({
                success: true,
                id: results.insertId,
                total_recepcion: total_recepcion,
                total_a_recibir: ticket.total_a_recibir,
                diferencia_total: diferencia_total
            });
        });
    });
});

// GET - Obtener fechas disponibles
app.get('/api/envases/fechas-disponibles', (req, res) => {
  const query = 'SELECT DISTINCT fecha FROM tickets_envases ORDER BY fecha DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error obteniendo fechas:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    
    const fechas = results.map(row => row.fecha);
    res.json(fechas);
  });
});




// Puerto del servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http:/localhost:${PORT}`);
});
