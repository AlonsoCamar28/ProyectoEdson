CREATE DATABASE novastore;
USE novastore;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  rol ENUM('admin','cliente') DEFAULT 'cliente'
);


CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  precio DECIMAL(10,2),
  imagen VARCHAR(255)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  cantidad INT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (nombre, email, password, rol)
VALUES (
  'Administrador',
  'admin@novastore.com',
  '$2b$10$rNy8RBRLchW6K5F/0hNDveZAUioAkoIJAo9HWObM6rtG7Plp/2sva',
  'admin'
);



CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  precio DECIMAL(10,2),
  imagen VARCHAR(255)
);

/*------------------------------------------------------------------------------------------*/

-- 1. Modificar la columna para aceptar 'vendedor'
ALTER TABLE users MODIFY COLUMN rol ENUM('admin','cliente','vendedor') DEFAULT 'cliente';

-- 2. Insertar 5 Vendedores (Pass: 123456)
INSERT INTO users (nombre, email, password, rol) VALUES 
('Carlos Vendedor 1', 'vendedor1@nova.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'vendedor'),
('Ana Venta', 'vendedor2@nova.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'vendedor'),
('Roberto Sales', 'vendedor3@nova.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'vendedor'),
('Lucia Shop', 'vendedor4@nova.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'vendedor'),
('Pedro Merchant', 'vendedor5@nova.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'vendedor');

-- 3. Insertar 25 Clientes (Pass: 123456)
INSERT INTO users (nombre, email, password, rol) VALUES 
('Cliente Uno', 'c1@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Cliente Dos', 'c2@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Maria Lopez', 'c3@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Juan Perez', 'c4@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Sofia Garcia', 'c5@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Luis Rodriguez', 'c6@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Elena Martinez', 'c7@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Miguel Hernandez', 'c8@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Laura Gonzalez', 'c9@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('David Sanchez', 'c10@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Carmen Ramirez', 'c11@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Javier Torres', 'c12@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Paula Flores', 'c13@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Alejandro Rivera', 'c14@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Patricia Gomez', 'c15@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Diego Diaz', 'c16@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Andrea Reyes', 'c17@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Ricardo Morales', 'c18@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Isabel Castillo', 'c19@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Fernando Ortega', 'c20@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Gabriela Mendoza', 'c21@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Hugo Vargas', 'c22@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Daniela Castro', 'c23@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Manuel Romero', 'c24@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente'),
('Veronica Herrera', 'c25@mail.com', '$2b$10$KqCaahb1QGAbwsDsIb.vSuTCmNC7M7G3lWnWi.xh2z7RBBOM7WILC', 'cliente');




-- inserts de clientes

USE novastore;

INSERT INTO products (nombre, descripcion, precio, imagen) VALUES 
('iPhone 15 Pro', 'Titanio, Chip A17 Pro, la potencia definitiva.', 23999.00, '/img/default.png'),
('Samsung Galaxy S24 Ultra', 'IA integrada, cámara de 200MP y S-Pen.', 26500.00, '/img/default.png'),
('MacBook Air M3', 'Diseño ultradelgado, chip M3 superrápido.', 22499.00, '/img/default.png'),
('Sony WH-1000XM5', 'Cancelación de ruido líder en la industria.', 6500.00, '/img/default.png'),
('Nintendo Switch OLED', 'Pantalla vibrante de 7 pulgadas, modo portátil.', 6999.00, '/img/default.png'),
('PlayStation 5 Slim', 'Diseño compacto, 1TB SSD, gráficos 4K.', 10999.00, '/img/default.png'),
('Xbox Series X', 'La consola más potente de Microsoft.', 11500.00, '/img/default.png'),
('iPad Air 5ta Gen', 'Pantalla Liquid Retina, Chip M1.', 13500.00, '/img/default.png'),
('Apple Watch Series 9', 'Doble toque mágico, pantalla siempre activa.', 8999.00, '/img/default.png'),
('Samsung Galaxy Watch 6', 'Monitor de salud avanzado, diseño clásico.', 5500.00, '/img/default.png'),
('AirPods Pro 2', 'Audio espacial personalizado, USB-C.', 4999.00, '/img/default.png'),
('Bose SoundLink Flex', 'Altavoz Bluetooth resistente al agua y polvo.', 3200.00, '/img/default.png'),
('GoPro Hero 12 Black', 'Video 5.3K, estabilización HyperSmooth 6.0.', 8200.00, '/img/default.png'),
('Monitor LG UltraWide 34"', 'Pantalla inmersiva 21:9 para productividad.', 7800.00, '/img/default.png'),
('Teclado Mecánico Keychron K2', 'Switches Gateron, retroiluminación RGB.', 2100.00, '/img/default.png'),
('Mouse Logitech MX Master 3S', 'Precisión extrema, silencioso y ergonómico.', 1800.00, '/img/default.png'),
('Google Pixel 8 Pro', 'La mejor cámara con IA de Google.', 19500.00, '/img/default.png'),
('Xiaomi 13T Pro', 'Cámaras Leica, carga rápida 120W.', 12500.00, '/img/default.png'),
('ASUS ROG Zephyrus G14', 'Laptop gamer compacta y potente.', 32000.00, '/img/default.png'),
('Dell XPS 13 Plus', 'Diseño futurista, pantalla OLED táctil.', 29000.00, '/img/default.png'),
('Kindle Paperwhite', 'Lectura sin reflejos, luz cálida ajustable.', 2800.00, '/img/default.png'),
('Echo Dot 5ta Gen', 'Asistente Alexa con mejor sonido.', 1200.00, '/img/default.png'),
('Google Nest Hub 2', 'Pantalla inteligente con control de sueño.', 1900.00, '/img/default.png'),
('Cámara Sony Alpha a6400', 'Enfoque automático rápido, video 4K.', 18500.00, '/img/default.png'),
('Drone DJI Mini 3', 'Ligero, video 4K HDR, vuelo vertical.', 14000.00, '/img/default.png'),
('Disco SSD Samsung 990 Pro 1TB', 'Velocidad máxima para PC y PS5.', 3500.00, '/img/default.png'),
('Tarjeta Gráfica RTX 4070', 'NVIDIA DLSS 3, Ray Tracing ultra.', 14500.00, '/img/default.png'),
('Procesador Ryzen 7 7800X3D', 'El mejor CPU para gaming actualmente.', 8900.00, '/img/default.png'),
('Memoria RAM Corsair 32GB DDR5', 'Alto rendimiento, 6000MHz.', 2800.00, '/img/default.png'),
('Fuente de Poder 850W Gold', 'Certificación 80 Plus, modular.', 2500.00, '/img/default.png'),
('Gabinete NZXT H5 Flow', 'Flujo de aire optimizado, panel de vidrio.', 2100.00, '/img/default.png'),
('Silla Gamer Secretlab Titan', 'Comodidad ergonómica premium.', 9500.00, '/img/default.png'),
('Escritorio Elevable Automático', 'Ajuste de altura eléctrico, memoria.', 7200.00, '/img/default.png'),
('Webcam Logitech Brio 4K', 'Calidad profesional para streaming.', 3800.00, '/img/default.png'),
('Micrófono HyperX QuadCast S', 'Iluminación RGB, condensador USB.', 2900.00, '/img/default.png'),
('Router WiFi 6 ASUS AX3000', 'Velocidad gigabit, baja latencia.', 2600.00, '/img/default.png'),
('Smart TV Samsung Neo QLED 55"', 'Resolución 4K, 120Hz para gaming.', 18000.00, '/img/default.png'),
('Barra de Sonido JBL Bar 5.0', 'Sonido envolvente Multibeam.', 6500.00, '/img/default.png'),
('Chromecast con Google TV', 'Streaming 4K con control de voz.', 1300.00, '/img/default.png'),
('Roku Streaming Stick 4K', 'Portátil, largo alcance WiFi.', 1100.00, '/img/default.png'),
('Cargador Anker 65W GaN', 'Carga rápida compacta para laptop y cel.', 900.00, '/img/default.png'),
('Power Bank Xiaomi 20000mAh', 'Batería externa de alta capacidad.', 850.00, '/img/default.png'),
('Mochila Antirrobo Tech', 'Impermeable, puerto USB de carga.', 1200.00, '/img/default.png'),
('Hub USB-C 8 en 1', 'HDMI, Ethernet, SD, USB 3.0.', 800.00, '/img/default.png'),
('Soporte Laptop Aluminio', 'Ajustable, disipación de calor.', 600.00, '/img/default.png'),
('Cable HDMI 2.1 8K', 'Alta velocidad certificado ultra.', 450.00, '/img/default.png'),
('Kit Tiras LED Philips Hue', 'Iluminación inteligente ambiental.', 1900.00, '/img/default.png'),
('Enchufe Inteligente TP-Link', 'Control remoto y horarios via app.', 350.00, '/img/default.png'),
('Foco Inteligente Wiz Color', 'Millones de colores, WiFi.', 250.00, '/img/default.png'),
('Tablet Samsung Galaxy Tab S9', 'Resistente al agua, pantalla AMOLED.', 16500.00, '/img/default.png');



select * from users;
