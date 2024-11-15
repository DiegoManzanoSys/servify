// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',      
  user: 'root',           
  password: '',           
  database: 'servify'  
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar: ' + err.stack);
    return;
  }
  console.log('Conexión exitosa con ID: ' + connection.threadId);
});

module.exports = connection;
