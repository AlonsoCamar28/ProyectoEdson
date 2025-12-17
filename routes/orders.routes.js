const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/checkout', (req, res) => {
  const user = req.session.user;
  const cart = req.session.cart;

  if (!user || !cart || cart.length === 0)
    return res.status(400).send('Carrito vacío');

  const total = cart.reduce((s, p) => s + p.precio * p.cantidad, 0);

  db.query(
    'INSERT INTO orders (user_id, total) VALUES (?, ?)',
    [user.id, total],
    (err, orderResult) => {
      if (err) return res.status(500).send('Error orden');

      const orderId = orderResult.insertId;

      const values = cart.map(p => [
        orderId,
        p.productId,
        p.cantidad
      ]);

      db.query(
        'INSERT INTO order_items (order_id, product_id, cantidad) VALUES ?',
        [values],
        (err) => {
          if (err) return res.status(500).send('Error items');

          req.session.cart = []; // limpiar carrito
          res.json({ msg: 'Compra realizada', orderId });
        }
      );
    }
  );
});

module.exports = router;
