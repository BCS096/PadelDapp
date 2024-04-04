// index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'padel'
});

// Conectar a la base de datos
connection.connect(err => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta de ejemplo para obtener datos desde la base de datos
app.get('/api/data', (req, res) => {
    connection.query('SELECT * FROM usuario', (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json(results);
    });
});

//añadir torneo
app.post('/api/torneo', (req, res) => {
    const { address, owner} = req.body;
    connection.query('INSERT INTO torneo (address, owner, status) VALUES (?, ?, ?)', [address, owner, "open"], (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json({ id: result.insertId });
    });
});

//añadir usuario
app.post('/api/usuario', (req, res) => {
    const { address } = req.body;
    connection.query('INSERT INTO usuario (address) VALUES (?)', [address], (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json({ id: result.insertId });
    });
});

//update usuario
app.put('/api/usuario/:address', (req, res) => {
    const address = req.params.address;
    const { name, email, telefono } = req.body;
    
    let updateFields = {};

    if (name) {
        updateFields.name = name;
    }

    if (email) {
        updateFields.email = email;
    }

    if (telefono) {
        updateFields.telefono = telefono;
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    connection.query('UPDATE usuario SET ? WHERE address = ?', [updateFields, address], (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });
    });
});

//añadir participacion
app.post('/api/participacion', (req, res) => {
    const { jugador1, jugador2, torneo } = req.body;
    let equipoId;
    connection.beginTransaction(err => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        connection.query('SELECT * FROM equipo WHERE (jugador1 = ? AND jugador2 = ?) OR (jugador1 = ? AND jugador2 = ?) FOR UPDATE', [jugador1, jugador2, jugador2, jugador1], (err, result) => {
            if (err) {
                console.log("ERROR EN LA VALIDACION DE EQUIPO");
                connection.rollback(() => {
                    console.error('Error al ejecutar la consulta:', err);
                    res.status(500).json({ error: 'Error interno del servidor' });
                });
                return;
            }
            // si no hay un equipo hecho hay que crearlo
            if (result.length == 0) {
                connection.query('INSERT INTO equipo (jugador1, jugador2) VALUES (?, ?)', [jugador1, jugador2], (err, result) => {
                    if (err) {
                        console.error('Error al ejecutar la consulta:', err);
                        connection.rollback(() => {
                            res.status(500).json({ error: 'Error interno del servidor' });
                        });
                        return;
                    }
                    equipoId = result.insertId;
                    connection.query('INSERT INTO participacion (equipoId, torneoAddress) VALUES (?, ?)', [equipoId, torneo], (err, result) => {
                        if (err) {
                            console.error('Error al ejecutar la consulta:', err);
                            connection.rollback(() => {
                                res.status(500).json({ error: 'Error interno del servidor' });
                            });
                            return;
                        }
                        connection.commit(err => {
                            if (err) {
                                console.error('Error al confirmar la transacción:', err);
                                connection.rollback(() => {
                                    res.status(500).json({ error: 'Error interno del servidor' });
                                });
                                return;
                            }
                            res.json({ id: result.insertId });
                        });
                    });
                });
            } else {
                equipoId = result[0].id;
                connection.query('INSERT INTO participacion (equipoId, torneoAddress) VALUES (?, ?)', [equipoId, torneo], (err, result) => {
                    if (err) {
                        if (err.code == 'ER_DUP_ENTRY') {
                            connection.rollback(() => {
                                res.status(400).json({ error: 'Equipo ya inscrito' });
                            });
                            return;
                        }
                        console.error('Error al ejecutar la consulta:', err);
                        connection.rollback(() => {
                            res.status(500).json({ error: 'Error interno del servidor' });
                        });
                        return;
                    }
                    connection.commit(err => {
                        if (err) {
                            console.error('Error al confirmar la transacción:', err);
                            connection.rollback(() => {
                                res.status(500).json({ error: 'Error interno del servidor' });
                            });
                            return;
                        }
                        res.json({ id: result.insertId });
                    });
                });
            }
        });
    });
});

//update torneoStatus
app.put('/api/torneo/:address/status', (req, res) => {
    const address = req.params.address;
    const { status } = req.body;
    
    let updateFields = {};

    if (status) {
        updateFields.status = status;
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    connection.query('UPDATE torneo SET ? WHERE address = ?', [updateFields, address], (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Torneo no encontrado' });
        }

        res.json({ message: 'Torneo actualizado correctamente' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend en ejecución en el puerto ${PORT}`);
});