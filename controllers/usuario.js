// controllers/usuario.js
const db = require('../bbdd'); // Conexión a la base de datos

// Función: Crear un nuevo usuario
// Descripción: Crea un nuevo usuario en la base de datos, verificando que todos los campos sean proporcionados.
// Recibe: req.body (contiene los datos del usuario: id_usuario, p_nombre, p_apellidos, p_email, fecha_nacimiento, domicilio)
// Regresa: Un objeto JSON con el mensaje 'Usuario creado' y el id_usuario si todo es correcto, o un error si falta algún campo o falla la conexión a la base de datos.
const crearUsuario = async (req, res) => {
  const { id_usuario, p_nombre, p_apellidos, p_email, fecha_nacimiento, domicilio } = req.body;

  // Verifica si faltan campos requeridos
  if (!p_nombre || !p_apellidos || !p_email || !fecha_nacimiento || !domicilio) {
    return res.status(400).json({ error: 'Llene todos los campos' });
  }

  // Consulta para llamar al procedimiento almacenado y crear el usuario en la base de datos
  const query = 'CALL sp_create_usuario(?, ?, ?, ?, ?, ?)';
  db.query(query, [id_usuario, p_nombre, p_apellidos, p_email, fecha_nacimiento, domicilio], (err, results) => {
    if (err) {
      // Si hay un error en la consulta, se retorna un error 500 con el mensaje del error
      return res.status(500).json({ error: err.message });
    }
    // Si todo es correcto, se retorna un mensaje de éxito con el id del usuario creado
    res.status(201).json({ message: 'Usuario creado', id_usuario });
  });
};

// Función: Obtener todos los usuarios
// Descripción: Obtiene la lista completa de usuarios desde la base de datos usando un procedimiento almacenado.
// Recibe: Ningún dato, solo una solicitud GET.
// Regresa: Un objeto JSON con los datos de todos los usuarios obtenidos de la base de datos.
const obtenerUsuarios = async (req, res) => {
  const query = 'CALL sp_read_all_users()';
  db.query(query, (err, results) => {
    if (err) {
      // Si ocurre un error, se retorna un error 500
      return res.status(500).json({ error: err.message });
    }
    // Si todo es correcto, se retorna la lista de usuarios
    res.status(200).json(results[0]);
  });
};

// Función: Obtener un usuario por ID
// Descripción: Obtiene los datos de un usuario específico usando su ID.
// Recibe: req.params.id (ID del usuario a buscar)
// Regresa: Un objeto JSON con los datos del usuario encontrado, o un mensaje de error si no se encuentra.
const obtenerUsuarioPorId = async (req, res) => {
  const idusuario = req.params.id; // Obtener el ID desde los parámetros de la ruta
  const query = 'CALL sp_read_usuario(?)';
  db.query(query, [idusuario], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Si no se encuentra ningún resultado, se devuelve un mensaje de error
    if (results[0].length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Si el usuario es encontrado, se devuelve sus datos
    res.status(200).json(results[0][0]);
  });
};

// Función: Actualizar un usuario
// Descripción: Actualiza los datos de un usuario existente en la base de datos.
// Recibe: req.params.id (ID del usuario que se va a actualizar) y req.body (datos a actualizar: p_nombre, p_apellidos, etc.)
// Regresa: Un mensaje de éxito o error, dependiendo del resultado de la actualización.
const actualizarUsuario = async (req, res) => {
  const { id } = req.params; // Obtener ID desde los parámetros de la ruta
  const { p_nombre, p_apellidos, p_email, fecha_nacimiento, domicilio } = req.body; // Extraer los datos del cuerpo de la solicitud
  const query = 'CALL sp_update_usuario(?, ?, ?, ?, ?, ?)';
  db.query(query, [id, p_nombre, p_apellidos, p_email, fecha_nacimiento, domicilio], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Si no se ha actualizado ningún usuario (por ejemplo, si no existe o ya estaba igual), se muestra un error
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o no actualizado' });
    }
    // Si se actualizó correctamente, se muestra un mensaje de éxito
    res.status(200).json({ message: 'Usuario actualizado' });
  });
};

// Función: Eliminar un usuario
// Descripción: Elimina un usuario de la base de datos usando su ID.
// Recibe: req.params.id (ID del usuario a eliminar)
// Regresa: Un mensaje de éxito si el usuario es eliminado correctamente.
const eliminarUsuario = async (req, res) => {
  const { id } = req.params; // Obtener ID desde los parámetros de la ruta
  const query = 'CALL sp_delete_usuario(?)';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Si todo es correcto, se devuelve un mensaje indicando que el usuario fue eliminado
    res.status(200).json({ message: 'Usuario eliminado' });
  });
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};
