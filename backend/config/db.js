const mysql = require('mysql2');

// Configurar conexion

const connection = mysql.createConnection({
    host: '192.168.1.118',
    user: 'osvaldo',
    password: 'osv',
    database: 'corona',
    port: 3306
});

// Conectary manejar errores

connection.connect(err => {
    if(err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conexion exitosa a MariaDB');
});

module.exports = connection;