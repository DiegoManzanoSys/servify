// tokens.js
const { Router } = require('express');  // Importar el módulo Router de Express para definir rutas
const dotenv = require("dotenv");  // Importar dotenv para manejar variables de entorno
const router = Router();  // Crear una nueva instancia de Router
dotenv.config();  // Cargar las variables de entorno

const jwt = require('jsonwebtoken');  // Importar jsonwebtoken para generar y verificar JWTs

// Ruta para generar un token JWT
// Descripción: Genera un token JWT para el usuario con id_usuario = 1
// Recibe: Ningún parámetro en la solicitud
// Regresa: Un objeto JSON con el token generado y un mensaje de éxito
router.get('/token', (_req, res) => {    
  const token = jwt.sign({ id_usuario: 1 }, process.env.SECRET_KEY, {expiresIn: '1d'});  // Generar el token con una duración de 365 días
  return res.status(200).json({
    error: false,
    statusCode: 200,
    data: token,  // Retornar el token generado
  });
})

module.exports = router;  // Exportar el router para usarlo en el servidor
