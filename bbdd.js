// bbdd.js
require('dotenv').config();  // Cargar variables de entorno desde el archivo .env
const mysql = require("mysql2");  // Importar el módulo mysql2 para manejar la conexión a la base de datos MySQL

// Crear la conexión con la base de datos utilizando las variables de entorno
// Recibe: Las variables de entorno de la base de datos desde el archivo .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
// Regresa: Una conexión establecida a la base de datos, o un error si no se puede conectar
const connection = mysql.createConnection({
  host: process.env.DB_HOST,  // El host de la base de datos, obtenido desde las variables de entorno
  user: process.env.DB_USER,  // El usuario de la base de datos, obtenido desde las variables de entorno
  password: process.env.DB_PASSWORD,  // La contraseña de la base de datos, obtenida desde las variables de entorno
  database: process.env.DB_NAME  // El nombre de la base de datos, obtenido desde las variables de entorno
});

// Conectar a la base de datos y manejar posibles errores
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar: " + err.stack); // Si hay un error de conexión, mostrarlo en consola
    return;
  }
  console.log("Conexión exitosa con ID: " + connection.threadId);  // Si la conexión es exitosa, mostrar el ID del hilo
});

// Exportar la conexión para que pueda ser usada en otros archivos
module.exports = connection;
