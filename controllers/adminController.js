const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. LEER USUARIOS (GET)
exports.getUsers = (req, res) => {
    const { rol } = req.query; 
    let sql = 'SELECT id, nombre, email, rol FROM users';
    let params = [];

    if (rol) {
        sql += ' WHERE rol = ?';
        params.push(rol);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error DB');
        }
        res.json(results);
    });
};

// 2. CREAR USUARIO (POST) <--- ¡ESTA ES LA QUE PROBABLEMENTE TE FALTA!
exports.createUser = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
        return res.status(400).send('Faltan datos obligatorios');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
        
        db.query(sql, [nombre, email, hashedPassword, rol], (err, result) => {
            if (err) {
                console.error(err);
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).send('Correo duplicado');
                return res.status(500).send('Error al crear usuario');
            }
            res.status(201).send('Usuario creado');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error servidor');
    }
};

// 3. ACTUALIZAR USUARIO (PUT)
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    try {
        let sql = '';
        let params = [];

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            sql = 'UPDATE users SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?';
            params = [nombre, email, hashedPassword, rol, id];
        } else {
            sql = 'UPDATE users SET nombre = ?, email = ?, rol = ? WHERE id = ?';
            params = [nombre, email, rol, id];
        }

        db.query(sql, params, (err, result) => {
            if (err) return res.status(500).send('Error al actualizar');
            res.send('Usuario actualizado');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en servidor');
    }
};

// 4. ELIMINAR USUARIO (DELETE)
exports.deleteUser = (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
        if(err) return res.status(500).send('Error al eliminar');
        res.sendStatus(200);
    });
};