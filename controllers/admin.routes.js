const express = require('express');
const router = express.Router();

// Importamos el controlador que ya tienes en la carpeta controllers
const adminController = require('../controllers/adminController');

// DEFINICIÓN DE RUTAS
// Cuando el navegador pida GET /admin/users, ejecutamos getUsers del controlador
router.get('/users', adminController.getUsers);

// Cuando el navegador pida DELETE /admin/users/5, ejecutamos deleteUser del controlador
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;