// routes/orderRoutes.js - REEMPLAZAR COMPLETO
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const isAuth = (req, res, next) => {
  if (!req.session.user) return res.status(401).send('No autorizado');
  next();
};

// ============================================
// 1. CHECKOUT CON MÉTODO DE PAGO
// ============================================
router.post('/checkout', isAuth, (req, res) => {
  const user = req.session.user;
  const cart = req.session.cart;
  const { payment_method_id } = req.body;

  // Validaciones
  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: 'Carrito vacío' });
  }

  if (!payment_method_id) {
    return res.status(400).json({ error: 'Debes seleccionar un método de pago' });
  }

  // Verificar que el método de pago pertenezca al usuario
  db.query(
    'SELECT id FROM payment_methods WHERE id = ? AND user_id = ?',
    [payment_method_id, user.id],
    (errPayment, paymentResults) => {
      if (errPayment || paymentResults.length === 0) {
        return res.status(403).json({ error: 'Método de pago inválido' });
      }

      const total = cart.reduce((s, p) => s + p.precio * p.cantidad, 0);

      // Insertar orden con método de pago
      db.query(
        'INSERT INTO orders (user_id, total, payment_method_id, estado) VALUES (?, ?, ?, ?)',
        [user.id, total, payment_method_id, 'pagado'],
        (err, orderResult) => {
          if (err) {
            console.error('Error creando orden:', err);
            return res.status(500).json({ error: 'Error al crear orden' });
          }

          const orderId = orderResult.insertId;

          // Insertar items de la orden
          const values = cart.map(p => [orderId, p.productId, p.cantidad]);

          db.query(
            'INSERT INTO order_items (order_id, product_id, cantidad) VALUES ?',
            [values],
            (errItems) => {
              if (errItems) {
                console.error('Error insertando items:', errItems);
                return res.status(500).json({ error: 'Error guardando productos' });
              }

              // Limpiar carrito
              req.session.cart = [];
              
              res.json({ 
                msg: 'Compra realizada con éxito', 
                orderId 
              });
            }
          );
        }
      );
    }
  );
});

// ============================================
// 2. OBTENER HISTORIAL DE ÓRDENES
// ============================================
router.get('/history', isAuth, (req, res) => {
  const userId = req.session.user.id;

  db.query(
    `SELECT 
      o.id,
      o.total,
      o.fecha,
      o.estado,
      pm.tipo AS metodo_pago,
      pm.ultimos_digitos
     FROM orders o
     LEFT JOIN payment_methods pm ON o.payment_method_id = pm.id
     WHERE o.user_id = ?
     ORDER BY o.fecha DESC`,
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error obteniendo historial:', err);
        return res.status(500).json({ error: 'Error en BD' });
      }
      res.json(results);
    }
  );
});

// ============================================
// 3. OBTENER DETALLE DE UNA ORDEN
// ============================================
router.get('/:orderId', isAuth, (req, res) => {
  const userId = req.session.user.id;
  const orderId = req.params.orderId;

  db.query(
    `SELECT 
      oi.product_id,
      p.nombre,
      p.imagen,
      oi.cantidad,
      p.precio
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     JOIN orders o ON oi.order_id = o.id
     WHERE oi.order_id = ? AND o.user_id = ?`,
    [orderId, userId],
    (err, results) => {
      if (err) {
        console.error('Error obteniendo detalle:', err);
        return res.status(500).json({ error: 'Error en BD' });
      }
      res.json(results);
    }
  );
});

module.exports = router;