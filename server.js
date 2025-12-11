    const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 1. Configurar carpeta de archivos estáticos (CSS, JS Cliente, imágenes)
// Esto permite que el HTML acceda a /css y /js sin problemas
app.use(express.static(path.join(__dirname, 'public')));

// 2. Ruta Principal: Cuando entren a localhost:3000, enviamos el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// 3. Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    console.log('Presiona Ctrl + C para detenerlo');
});