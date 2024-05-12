// index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

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
app.get('/api/clubs', (req, res) => {

    connection.query('SELECT * FROM club', (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        for (let i = 0; i < results.length; i++) {
            results[i].foto = 'http://localhost:3000/images/' + results[i].foto;
          }
        res.json(results);
    });
});

app.get('/api/club/:address', (req, res) => {

    const address = req.params.address;
    
    connection.query('SELECT * FROM club WHERE address = ?',[address], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        for (let i = 0; i < results.length; i++) {
            results[i].foto = 'http://localhost:3000/images/' + results[i].foto;
          }
        res.json(results[0]);
    });
});

//añadir torneo
app.post('/api/torneo', (req, res) => {
    const { address, owner} = req.body;
    connection.query('INSERT INTO torneo (address, owner, status) VALUES (?, ?, ?)', [address, owner, "OPENED"], (err, result) => {
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
    const { address, email, edad, telefono, genero, nombre} = req.body;
    connection.query('INSERT INTO jugador (address, email, nombre, genero, edad, telefono) VALUES (?, ?, ?, ?, ?, ?)', [address, email, nombre, genero, edad, telefono], (err, result) => {
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
    const { name, email, telefono, genero, edad } = req.body;
    
    let updateFields = {};

    if (name) {
        updateFields.nombre = name;
    }

    if (email) {
        updateFields.email = email;
    }

    if (telefono) {
        updateFields.telefono = telefono;
    }

    if (genero) {
        updateFields.genero = genero;
    }

    if (edad) {
        updateFields.edad = edad;
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    connection.query('UPDATE jugador SET ? WHERE address = ?', [updateFields, address], (err, result) => {
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
                    connection.query('INSERT INTO participante (equipoId, addressTorneo) VALUES (?, ?)', [equipoId, torneo], (err, result) => {
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
                connection.query('INSERT INTO participante (equipoId, addressTorneo) VALUES (?, ?)', [equipoId, torneo], (err, result) => {
                    if (err) {
                        if (err.code == 'ER_DUP_ENTRY') {
                            connection.rollback(() => {
                                res.status(405).json({ error: 'Equipo ya inscrito' });
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

//cancelar participacion
app.delete('/api/participacion/:jugadorAddress/torneo/:addressTorneo', (req, res) => {
    const jugadorAddress = req.params.jugadorAddress;
    const addressTorneo = req.params.addressTorneo;
    connection.query('SELECT equipo.id FROM equipo JOIN participante ON jugador1 = ? OR jugador2 = ? WHERE addressTorneo = ?', [jugadorAddress, jugadorAddress, addressTorneo], (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        }
        const equipoId = result[0].id;
        connection.query('DELETE FROM participante WHERE equipoId = ? AND addressTorneo = ?', [equipoId, addressTorneo], (err, result) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Participacion no encontrada' });
            }
            res.json({ message: 'Participacion cancelada correctamente' });
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

//getTorneosByOwner
app.get('/api/torneo/owner/:owner', (req, res) => {
    const owner = req.params.owner;
    connection.query('SELECT * FROM torneo WHERE owner = ?', [owner], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json(results);
    });
});

//getTorneosByJugador
app.get('/api/torneo/player/:jugador', (req, res) => {
    const jugador = req.params.jugador;
    connection.query('SELECT * FROM torneo WHERE address IN (SELECT addressTorneo FROM participante WHERE equipoId IN (SELECT id FROM equipo WHERE jugador1 = ? OR jugador2 = ?))', [jugador, jugador], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json(results);
    });
});

//getUsuario
app.get('/api/usuario/:address', (req, res) => {
    const address = req.params.address;
    connection.query('SELECT * FROM jugador WHERE address = ?', [address], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json(results[0]);
    });
});

//getUsuariosByTorneo
app.get('/api/usuario/torneo/:address', (req, res) => {
    const address = req.params.address;
    // SELECT usuario.*, equipoId FROM usuario JOIN equipo ON usuario.address = equipo.jugador1 OR usuario.address = equipo.jugador2 JOIN participante ON equipo.id = participante.equipoId WHERE participante.addressTorneo = 'torneo';
    connection.query('SELECT jugador.*, equipoId FROM jugador JOIN equipo ON jugador.address = equipo.jugador1 OR jugador.address = equipo.jugador2 ' +
     'JOIN participante ON equipo.id = participante.equipoId WHERE participante.addressTorneo = ?', [address], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json(results);
    });
});

//getTorneosActivos
app.get('/api/torneo/activos', (req, res) => {
    connection.query('SELECT * FROM torneo WHERE status NOT IN ("CANCELED","FINISHED")', (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend en ejecución en el puerto ${PORT}`);
});