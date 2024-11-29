// middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Función: Verificar el token JWT
// Descripción: Este middleware verifica la validez del token JWT presente en los encabezados de la solicitud.
// Recibe: req.headers['authorization'] (El token JWT en el encabezado 'Authorization' de la solicitud)
// Regresa: Si el token es válido, pasa al siguiente middleware. Si no, responde con un error 403 (Forbidden).
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']; // Obtener el token del encabezado Authorization

  // Si no se recibe un token, retorna un error
  if (!token) {
    return res.status(403).json({ error: 'Token requerido' });
  }

  // Eliminar la palabra "Bearer" del token (si está presente)
  const tokenSinBearer = token.split(' ')[1];

  // Verificar si el token es válido con la clave secreta
  jwt.verify(tokenSinBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token no válido' });
    }

    req.user = decoded; // Agregar la información decodificada del token al request
    next(); // Continuar con la ejecución de la ruta
  });
};

module.exports = verificarToken;
