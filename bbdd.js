require("dotenv").config(); // Cargar variables de entorno desde el archivo .env
const { Client } = require("pg"); // Importar el módulo pg para manejar la conexión a PostgreSQL

// Crear el cliente con la configuración de la base de datos utilizando las variables de entorno
// Recibe: Las variables de entorno de la base de datos desde el archivo .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT)
// Regresa: Un cliente conectado a la base de datos, o un error si no se puede conectar
const client = new Client({
  host: process.env.DB_HOST, // El host de la base de datos
  user: process.env.DB_USER, // El usuario de la base de datos
  password: process.env.DB_PASSWORD, // La contraseña de la base de datos
  database: process.env.DB_NAME, // El nombre de la base de datos
  port: process.env.DB_PORT, // El puerto de la base de datos (por defecto 5432)
});

// Conectar a la base de datos y manejar posibles errores
client.connect((err) => {
  if (err) {
    console.error("Error al conectar a PostgreSQL: " + err.stack); // Si hay un error de conexión, mostrarlo en consola
    return;
  }
  console.log("Conexión exitosa a PostgreSQL"); // Si la conexión es exitosa, mostrar un mensaje
});

// Exportar el cliente para que pueda ser usado en otros archivos
module.exports = client;
