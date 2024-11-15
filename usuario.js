// usuariosController.js
const db = require('./db');  // Importa la conexión a la base de datos

// Crear un nuevo usuario

const crearUsuario = async(req, res) => {

  const {id_usuario, p_nombre, p_apellidos, p_email, fecha_nacimiento, domicilio } = req.body;

  if (!p_nombre || !p_apellidos || !p_email || !fecha_nacimiento || !domicilio) {
      return res.status(400).json({ error: 'Llene todos los campos' });
  }


  const query = 'CALL sp_create_usuario(?, ?, ?, ?, ?, ?)';

  db.query(query, [id_usuario, p_nombre, p_apellidos, p_email, fecha_nacimiento, domicilio], (err, results) => {
      if (err) {
          console.error('Error en la base de datos:', err);
          return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Usuario creado', id_usuario: id_usuario });
  });

  console.log('Datos recibidos:', req.body);
};


// Obtener todos los usuarios
const obtenerUsuarios = async(req, res) => {
  const query = 'CALL sp_read_all_users()';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results[0]); 
  });
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async(req, res) => {
  const idusuario = req.params.id;
  const query = 'CALL sp_read_usuario(?)';
  
  db.query(query, [idusuario], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results[0].length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(results[0][0]); 
  });
};

// Actualizar un usuario
const actualizarUsuario = async(req, res) => {
  const { id } = req.params;
  const { p_nombre, p_apellidos, p_email, fecha_nacimiento, domicilio } = req.body;
  const query = 'CALL sp_update_usuario(?, ?, ?, ?, ?, ?)';

  db.query(query, [id, p_nombre, p_apellidos, p_email, fecha_nacimiento, domicilio], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o no actualizado' });
    }
    res.status(200).json({ message: 'Usuario actualizado' });
  });
  
};

// Eliminar un usuario
const eliminarUsuario = async(req, res) => {
  const { id } = req.params;
  const query = 'CALL sp_delete_usuario(?)';

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
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
