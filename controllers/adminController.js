const db = require('../config/db');
const bcrypt = require('bcryptjs');


exports.getUsers = (req, res) => {
  // 1. Recibimos el parámetro 'rol' desde la URL (ej: ?rol=cliente)
  const { rol } = req.query; 

  // 2. Preparamos la consulta base
  let sql = 'SELECT id, nombre, email, rol FROM users';
  let params = [];

  // 3. Si nos pidieron un rol específico, agregamos el filtro WHERE
  if (rol) {
    sql += ' WHERE rol = ?';
    params.push(rol);
  }

  // 4. Ejecutamos la consulta dinámica
  db.query(sql, params, (err, results) => {
    if (err) {
        console.error("Error obteniendo usuarios:", err);
        return res.status(500).send('Error en la base de datos');
    }
    res.json(results);
  });
};

// Esta función déjala igual, no necesita cambios por ahora
exports.deleteUser = (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], () => {
    res.sendStatus(200);
  });
};


// ... (código anterior getDelete, etc)

// FUNCIÓN PARA CREAR USUARIO (CREATE)
exports.createUser = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
        return res.status(400).send('Faltan datos obligatorios');
    }

    try {
        // --- AQUÍ ESTÁ LA MAGIA DEL "BCH" (BCRYPT) ---
        // El '10' es el nivel de seguridad (salt)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = 'INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
        
        // OJO: Guardamos 'hashedPassword', NO 'password'
        db.query(sql, [nombre, email, hashedPassword, rol], (err, result) => {
            if (err) {
                console.error(err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('El correo ya está registrado');
                }
                return res.status(500).send('Error al crear usuario');
            }
            res.status(201).send('Usuario creado con éxito');
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor al encriptar');
    }
};