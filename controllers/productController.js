const db = require('../config/db');

exports.getProducts = (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.create = (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  db.query(
    'INSERT INTO products (nombre, descripcion, precio) VALUES (?,?,?)',
    [nombre, descripcion, precio],
    (err) => {
      if (err) return res.status(500).json(err);
      res.sendStatus(201);
    }
  );
};
