const db = require('../config/db');

exports.getUsers = (req, res) => {
  db.query('SELECT id,nombre,email,rol FROM users', (err, results) => {
    res.json(results);
  });
};

exports.deleteUser = (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], () => {
    res.sendStatus(200);
  });
};
