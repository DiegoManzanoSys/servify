const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require("https");
const usuariosController = require("./usuario"); // Importar controlador de usuarios

const app = express();
const port = 3000; // Puerto HTTP
const httpsPort = 3443; // Puerto HTTPS

app.use(bodyParser.json());

// Rutas de la API para usuarios
app.post("/createUsuario", usuariosController.crearUsuario);
app.get("/usuarios", usuariosController.obtenerUsuarios);
app.get("/getUsuario/:id", usuariosController.obtenerUsuarioPorId);
app.put("/upUsuario/:id", usuariosController.actualizarUsuario);
app.delete("/deleteUsuario/:id", usuariosController.eliminarUsuario);

// Cargar los certificados SSL/TLS
const httpsOptions = {
  key: fs.readFileSync("key.pem"), // Clave privada
  cert: fs.readFileSync("cert.pem"), // Certificado
};

// Iniciar servidor HTTP (opcional, para redirigir a HTTPS)
app.listen(port, () => {
  console.log(`Servidor HTTP escuchando en http://localhost:${port}`);
});

// Iniciar servidor HTTPS
https.createServer(httpsOptions, app).listen(httpsPort, () => {
  console.log(`Servidor HTTPS escuchando en https://localhost:${httpsPort}`);
});
