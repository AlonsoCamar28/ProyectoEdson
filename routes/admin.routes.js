const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const { isAdmin } = require('../middleware/authMiddleware');

// Usuarios
router.get('/users', isAdmin, adminController.getUsers);
router.delete('/users/:id', isAdmin, adminController.deleteUser);

// Productos
router.post('/products', isAdmin, productController.create);
router.post('/users', adminController.createUser);

module.exports = router;
