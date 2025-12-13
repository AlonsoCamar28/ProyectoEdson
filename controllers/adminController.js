const db = require('../config/db');

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