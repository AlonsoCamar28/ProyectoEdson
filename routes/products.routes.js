const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts); // ✅ SIN paréntesis


module.exports = router;
