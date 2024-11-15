// usuariosController.js
const db = require('./db');  // Importa la conexión a la base de datos

// Crear un nuevo usuario
const crearUsuario = (req, res) => {
  // Imprimir el cuerpo de la solicitud para depuración


  const {id_usuario, p_nombre, p_apellidos, p_email, fecha_nacimiento, domicilio } = req.body;



  // Validar que todos los campos requeridos estén presentes
  if (!p_nombre || !p_apellidos || !p_email || !fecha_nacimiento || !domicilio) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
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
const obtenerUsuarios = (req, res) => {
  const query = 'CALL sp_read_all_users()';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results[0]); // El resultado viene en un arreglo, así que accedemos al primer elemento
  });
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = (req, res) => {
  const idusuario = req.params.id;
  
  // Llamar al procedimiento almacenado sp_read_usuario
  const query = 'CALL sp_read_usuario(?)';
  
  db.query(query, [idusuario], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results[0].length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(results[0][0]); // Retornar el primer resultado del usuario
  });
};

// Actualizar un usuario
const actualizarUsuario = (req, res) => {
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
const eliminarUsuario = (req, res) => {
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
