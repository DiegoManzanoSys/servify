// routes.js
const { Router } = require('express');  // Importar el módulo Router de Express para definir las rutas de la API
const jwt = require('jsonwebtoken');  // Importar jsonwebtoken para generar y verificar JWTs
const dotenv = require('dotenv');  // Importar dotenv para cargar las variables de entorno desde el archivo .env
dotenv.config();  // Cargar las variables de entorno

const verificarToken = require('./middleware/auth');  // Importar middleware para verificar el token JWT
const usuariosController = require("./controllers/usuario");  // Importar el controlador de usuarios
const router = Router();  // Crear una nueva instancia de Router

// Ruta para obtener un token JWT
// Descripción: Genera un token JWT para el usuario con id_usuario = 1
// Recibe: Ningún parámetro en la solicitud
// Regresa: Un objeto JSON con el token generado y un mensaje de éxito
router.get('/token', (_req, res) => {
  const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET, { expiresIn: '365d' });  // Generar el token con una duración de 365 días
  return res.status(200).json({
    error: false,
    statusCode: 200,
    data: token,  // Retornar el token generado
  });
});

// Definir rutas de la API que requieren autenticación
// Las siguientes rutas están protegidas por el middleware 'verificarToken', que valida el JWT antes de procesar las solicitudes
router.post("/createUser", usuariosController.crearUsuario);  // Crear un nuevo usuario
router.get("/getAllUsers", verificarToken, usuariosController.obtenerUsuarios);  // Obtener todos los usuarios (requiere token)
router.get("/getUser/:id", verificarToken, usuariosController.obtenerUsuarioPorId);  // Obtener un usuario por ID (requiere token)
router.put("/upUser/:id", verificarToken, usuariosController.actualizarUsuario);  // Actualizar un usuario (requiere token)
router.delete("/deleteUser/:id", verificarToken, usuariosController.eliminarUsuario);  // Eliminar un usuario (requiere token)

module.exports = router;  // Exportar el router para usarlo en el servidor
