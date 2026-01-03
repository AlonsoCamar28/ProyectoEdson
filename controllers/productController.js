const db = require('../config/db');

// --- FUNCIÓN AUXILIAR: Obtener imágenes extra de un producto ---
const getImagesForProduct = (productId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT imagen_url FROM product_images WHERE product_id = ?', [productId], (err, results) => {
            if (err) resolve([]); // Si hay error, devolvemos array vacío para no romper nada
            else resolve(results.map(r => r.imagen_url));
        });
    });
};

// 1. OBTENER TODOS (Con Galería de Imágenes)
exports.getProducts = (req, res) => {
    db.query('SELECT * FROM products', async (err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error DB');
        }

        // Agregamos las imágenes extra a cada producto
        try {
            const productsWithImages = await Promise.all(products.map(async (p) => {
                const extraImages = await getImagesForProduct(p.id);
                // La galería incluye la imagen principal + las extras
                return { ...p, galeria: [p.imagen, ...extraImages] };
            }));
            res.json(productsWithImages);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error procesando imágenes');
        }
    });
};

// 2. CREAR PRODUCTO (Soporte Múltiples Imágenes y Stock)
exports.createProduct = (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    const files = req.files; // Imágenes subidas por Multer

    if (!nombre || !precio) return res.status(400).send('Faltan datos');

    // La primera imagen será la portada, si no hay, ponemos default
    const mainImage = files && files.length > 0 ? `/img/${files[0].filename}` : '/img/default.png';
    const stockValido = stock ? parseInt(stock) : 0;

    const sql = 'INSERT INTO products (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [nombre, descripcion, precio, stockValido, mainImage], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creando producto');
        }
        
        const productId = result.insertId;

        // Si hay más de 1 imagen, guardamos las extras en la tabla 'product_images'
        if (files && files.length > 1) {
            // Tomamos todas menos la primera (que ya es portada)
            const extraImages = files.slice(1).map(file => [productId, `/img/${file.filename}`]);
            
            if (extraImages.length > 0) {
                const sqlImg = 'INSERT INTO product_images (product_id, imagen_url) VALUES ?';
                db.query(sqlImg, [extraImages], (error) => {
                    if (error) console.error("Error guardando imágenes extra", error);
                });
            }
        }
        res.status(201).send('Producto creado con imágenes');
    });
};

// 3. ACTUALIZAR PRODUCTO
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    
    // Nota: Por simplicidad no actualizamos imágenes aquí, solo datos
    const stockValido = stock ? parseInt(stock) : 0;
    
    const sql = 'UPDATE products SET nombre=?, descripcion=?, precio=?, stock=? WHERE id=?';
    db.query(sql, [nombre, descripcion, precio, stockValido, id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating');
        }
        res.send('Actualizado');
    });
};

// 4. BORRAR PRODUCTO
exports.deleteProduct = (req, res) => {
    db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Error');
        }
        res.send('Eliminado');
    });
};

// 5. OBTENER DESTACADOS (¡Nombre corregido: getFeatured!)
exports.getFeatured = (req, res) => {
    db.query('SELECT * FROM products ORDER BY RAND() LIMIT 5', async (err, products) => {
        if (err) return res.status(500).send('Error db');
        
        // También les ponemos galería por si acaso
        const productsWithImages = await Promise.all(products.map(async (p) => {
            const extraImages = await getImagesForProduct(p.id);
            return { ...p, galeria: [p.imagen, ...extraImages] };
        }));
        
        res.json(productsWithImages);
    });
};

// 6. OBTENER POR CATEGORÍA (¡Nombre corregido: getByCategory!)
exports.getByCategory = (req, res) => {
    // Como aún no tienes tabla intermedia de categorías real, devolvemos todos
    // o filtramos si tuvieras la columna category_id
    const sql = 'SELECT * FROM products'; 
    db.query(sql, async (err, products) => {
        if (err) return res.status(500).send('Error db');

        const productsWithImages = await Promise.all(products.map(async (p) => {
            const extraImages = await getImagesForProduct(p.id);
            return { ...p, galeria: [p.imagen, ...extraImages] };
        }));

        res.json(productsWithImages);
    });
};