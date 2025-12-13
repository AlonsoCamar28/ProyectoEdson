const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'novastore'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL');
});

module.exports = db;
