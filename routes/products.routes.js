const express = require('express');
const router = express.Router();
// Ajusta la ruta ../controllers/productController según tus carpetas
const productController = require('../controllers/productController'); 

// Definición de Rutas
router.get('/', productController.getProducts);         // LEER
router.post('/', productController.createProduct);      // CREAR
router.put('/:id', productController.updateProduct);    // ACTUALIZAR (¡Nuevo!)
router.delete('/:id', productController.deleteProduct); // BORRAR (¡Nuevo!)
router.get('/category/:id', productController.getProductsByCategory);
router.get('/featured', productController.getFeaturedProducts);


module.exports = router;