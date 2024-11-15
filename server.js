// server.js
const express = require('express');
const bodyParser = require('body-parser');
const usuariosController = require('./usuario'); // Aquí estamos importando el controlador de usuarios

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Rutas de la API para usuarios
app.post('/createUsuario', usuariosController.crearUsuario);
app.get('/usuarios', usuariosController.obtenerUsuarios);
app.get('/getUsuario/:id', usuariosController.obtenerUsuarioPorId);
app.put('/upUsuario/:id', usuariosController.actualizarUsuario);
app.delete('/deleteUsuario/:id', usuariosController.eliminarUsuario);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
