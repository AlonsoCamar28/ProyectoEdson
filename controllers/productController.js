const db = require('../config/db');

// 1. OBTENER TODOS (READ)
exports.getProducts = (req, res) => {
    // CORRECCIÓN: Cambiamos 'productos' por 'products'
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al obtener productos');
        }
        res.json(results);
    });
};

// 2. CREAR PRODUCTO (CREATE)
exports.createProduct = (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    
    // CORRECCIÓN: La columna en tu BD se llama 'imagen', no 'imagen_url'
    const imagen = '/img/default.png'; 

    if (!nombre || !precio) {
        return res.status(400).send('Nombre y Precio son obligatorios');
    }

    // CORRECCIÓN: Tabla 'products' y columna 'imagen'
    const sql = 'INSERT INTO products (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [nombre, descripcion, precio, imagen], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al crear producto');
        }
        res.status(201).send('Producto creado');
    });
};

// 3. ACTUALIZAR PRODUCTO (UPDATE)
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;

    // CORRECCIÓN: Tabla 'products'
    const sql = 'UPDATE products SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?';
    
    db.query(sql, [nombre, descripcion, precio, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al actualizar');
        }
        res.send('Producto actualizado');
    });
};

// 4. BORRAR PRODUCTO (DELETE)
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    // CORRECCIÓN: Tabla 'products'
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al eliminar');
        }
        res.send('Producto eliminado');
    });
};