// server.js
const express = require("express");  // Importar Express para crear el servidor web
const bodyParser = require("body-parser");  // Importar body-parser para manejar los cuerpos de las solicitudes (JSON)
const usuariosController = require("./controllers/usuario");  // Importar el controlador de usuarios
const verificarToken = require('./middleware/auth');  // Importar middleware de autenticación para verificar los tokens
const routes = require('./routes');  // Importar las rutas definidas en routes.js

const app = express();  // Crear una instancia de la aplicación Express
const port = 3000;  // Definir el puerto en el que el servidor escuchará

app.use(bodyParser.json());  // Configurar body-parser para que procese las solicitudes con contenido JSON

// Usar las rutas definidas en routes.js y asociarlas al prefijo /api
app.use('/api', routes);  // Todas las rutas en 'routes.js' estarán disponibles con el prefijo '/api'

// Iniciar el servidor HTTP en el puerto 3000
// Descripción: Arranca el servidor web que escucha solicitudes en http://localhost:3000
app.listen(port, () => {
  console.log(`Servidor HTTP escuchando en http://localhost:${port}`);  // Mostrar mensaje cuando el servidor esté corriendo
});
