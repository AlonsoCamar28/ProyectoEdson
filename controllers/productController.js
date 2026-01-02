const db = require('../config/db');

// 1. OBTENER TODOS
exports.getProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al obtener productos');
        }
        res.json(results);
    });
};

// 2. CREAR PRODUCTO (AHORA CON STOCK)
exports.createProduct = (req, res) => {
    // Recibimos 'stock' del cuerpo de la petición
    const { nombre, descripcion, precio, stock } = req.body;
    const imagen = '/img/default.png'; 

    if (!nombre || !precio) {
        return res.status(400).send('Nombre y Precio son obligatorios');
    }

    // Validar que el stock sea un número válido (si no viene, ponemos 0)
    const stockValido = stock ? parseInt(stock) : 0;

    const sql = 'INSERT INTO products (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [nombre, descripcion, precio, stockValido, imagen], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al crear producto');
        }
        res.status(201).send('Producto creado');
    });
};

// 3. ACTUALIZAR PRODUCTO (AHORA CON STOCK)
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    const stockValido = stock ? parseInt(stock) : 0;

    const sql = 'UPDATE products SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?';
    
    db.query(sql, [nombre, descripcion, precio, stockValido, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al actualizar');
        }
        res.send('Producto actualizado');
    });
};

// 4. BORRAR PRODUCTO
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al eliminar');
        }
        res.send('Producto eliminado');
    });
};

exports.getProductsByCategory = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT p.*, c.nombre AS categoria
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send('Error filtro');
    res.json(results);
  });
};

exports.getFeaturedProducts = (req, res) => {
  db.query(
    'SELECT * FROM products ORDER BY RAND() LIMIT 8',
    (err, results) => {
      if (err) return res.status(500).send('Error destacados');
      res.json(results);
    }
  );
};

