const db = require('../config/db');
const fs = require('fs'); // Para crear carpetas y eliminar archivos
const path = require('path');

// --- FUNCIÓN AUXILIAR: Crear carpeta si no existe ---
const crearCarpetaSiNoExiste = (rutaCarpeta) => {
    if (!fs.existsSync(rutaCarpeta)) {
        fs.mkdirSync(rutaCarpeta, { recursive: true });
        console.log(`📁 Carpeta creada: ${rutaCarpeta}`);
    }
};

// --- FUNCIÓN AUXILIAR: Obtener imágenes extra de un producto ---
const getImagesForProduct = (productId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT imagen_url FROM product_images WHERE product_id = ?', [productId], (err, results) => {
            if (err) resolve([]);
            else resolve(results.map(r => r.imagen_url));
        });
    });
};

// --- FUNCIÓN AUXILIAR: Eliminar carpeta de producto (al borrar producto) ---
const eliminarCarpetaProducto = (productId) => {
    const carpetaProducto = path.join(__dirname, '../public/img/products', `producto-${productId}`);
    
    if (fs.existsSync(carpetaProducto)) {
        fs.rmSync(carpetaProducto, { recursive: true, force: true });
        console.log(`🗑️ Carpeta eliminada: ${carpetaProducto}`);
    }
};

// ============================================
// 1. OBTENER TODOS LOS PRODUCTOS (Con Galería)
// ============================================
exports.getProducts = (req, res) => {
    db.query('SELECT * FROM products', async (err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error DB');
        }

        try {
            const productsWithImages = await Promise.all(products.map(async (p) => {
                const extraImages = await getImagesForProduct(p.id);
                return { ...p, galeria: [p.imagen, ...extraImages] };
            }));
            res.json(productsWithImages);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error procesando imágenes');
        }
    });
};

// ============================================
// 2. CREAR PRODUCTO (CON CARPETA PROPIA)
// ============================================
exports.createProduct = (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    const files = req.files;

    if (!nombre || !precio) return res.status(400).send('Faltan datos');

    const stockValido = stock ? parseInt(stock) : 0;

    // Primero insertamos el producto SIN imágenes para obtener su ID
    const sql = 'INSERT INTO products (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [nombre, descripcion, precio, stockValido, '/img/default.png'], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creando producto');
        }
        
        const productId = result.insertId;

        // Si NO hay imágenes, dejamos la default y terminamos
        if (!files || files.length === 0) {
            return res.status(201).json({ 
                msg: 'Producto creado (sin imágenes)', 
                productId 
            });
        }

        // Crear carpeta específica para este producto
        const carpetaProducto = path.join(__dirname, '../public/img/products', `producto-${productId}`);
        crearCarpetaSiNoExiste(carpetaProducto);

        // Mover las imágenes a la carpeta del producto
        const imagenesMovidas = [];
        
        files.forEach((file, index) => {
            const nombreOriginal = file.filename;
            const rutaAntigua = file.path;
            const rutaNueva = path.join(carpetaProducto, nombreOriginal);
            
            // Mover archivo
            fs.renameSync(rutaAntigua, rutaNueva);
            
            // Guardar ruta relativa para la BD
            const rutaBD = `/img/products/producto-${productId}/${nombreOriginal}`;
            imagenesMovidas.push(rutaBD);
        });

        // Actualizar imagen principal (la primera)
        const mainImage = imagenesMovidas[0];
        db.query('UPDATE products SET imagen = ? WHERE id = ?', [mainImage, productId]);

        // Guardar imágenes extras (de la 2 en adelante)
        if (imagenesMovidas.length > 1) {
            const extraImages = imagenesMovidas.slice(1).map(img => [productId, img]);
            
            const sqlImg = 'INSERT INTO product_images (product_id, imagen_url) VALUES ?';
            db.query(sqlImg, [extraImages], (error) => {
                if (error) console.error("Error guardando imágenes extra", error);
            });
        }

        res.status(201).json({ 
            msg: 'Producto creado con imágenes', 
            productId,
            imagenes: imagenesMovidas.length
        });
    });
};

// ============================================
// 3. ACTUALIZAR PRODUCTO
// ============================================
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    const files = req.files;
    
    const stockValido = stock ? parseInt(stock) : 0;
    
    // Actualizar datos básicos
    const sql = 'UPDATE products SET nombre=?, descripcion=?, precio=?, stock=? WHERE id=?';
    db.query(sql, [nombre, descripcion, precio, stockValido, id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating');
        }

        // Si se subieron nuevas imágenes, agregarlas a la carpeta del producto
        if (files && files.length > 0) {
            const carpetaProducto = path.join(__dirname, '../public/img/products', `producto-${id}`);
            crearCarpetaSiNoExiste(carpetaProducto);

            const nuevasImagenes = [];
            
            files.forEach((file) => {
                const nombreOriginal = file.filename;
                const rutaAntigua = file.path;
                const rutaNueva = path.join(carpetaProducto, nombreOriginal);
                
                fs.renameSync(rutaAntigua, rutaNueva);
                
                const rutaBD = `/img/products/producto-${id}/${nombreOriginal}`;
                nuevasImagenes.push([id, rutaBD]);
            });

            // Agregar nuevas imágenes a la tabla
            if (nuevasImagenes.length > 0) {
                const sqlImg = 'INSERT INTO product_images (product_id, imagen_url) VALUES ?';
                db.query(sqlImg, [nuevasImagenes], (error) => {
                    if (error) console.error("Error agregando nuevas imágenes", error);
                });
            }
        }

        res.send('Producto actualizado');
    });
};

// ============================================
// 4. ELIMINAR PRODUCTO (Y SU CARPETA)
// ============================================
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    // Primero eliminar registros de imágenes
    db.query('DELETE FROM product_images WHERE product_id = ?', [id], (err) => {
        if (err) console.error('Error eliminando imágenes:', err);
    });

    // Luego eliminar el producto
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error');
        }

        // Finalmente eliminar la carpeta física del producto
        eliminarCarpetaProducto(id);

        res.send('Producto y carpeta eliminados');
    });
};

// ============================================
// 5. OBTENER DESTACADOS
// ============================================
exports.getFeatured = (req, res) => {
    db.query('SELECT * FROM products ORDER BY RAND() LIMIT 5', async (err, products) => {
        if (err) return res.status(500).send('Error db');
        
        const productsWithImages = await Promise.all(products.map(async (p) => {
            const extraImages = await getImagesForProduct(p.id);
            return { ...p, galeria: [p.imagen, ...extraImages] };
        }));
        
        res.json(productsWithImages);
    });
};

// ============================================
// 6. OBTENER POR CATEGORÍA
// ============================================
exports.getByCategory = (req, res) => {
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