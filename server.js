const express = require('express');
const path = require('path');
const session = require('express-session');


const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'novastore_secret',
  resave: false,
  saveUninitialized: true
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/auth', require('./routes/auth.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/products', require('./routes/products.routes'));
app.use('/categories', require('./routes/categories.routes'));
app.use('/cart', require('./routes/cart.routes'));
app.use('/orders', require('./routes/orders.routes'));
app.use('/payments', require('./routes/payments.routes'));
app.use('/ratings', require('./routes/rating.routes'));



// Landing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
