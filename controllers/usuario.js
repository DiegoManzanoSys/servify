// controllers/usuario.js
const db = require("../bbdd"); // Conexión a la base de datos

// Función: Crear un nuevo usuario
// Descripción: Crea un nuevo usuario en la base de datos, verificando que todos los campos sean proporcionados.
// Recibe: req.body (contiene los datos del usuario: p_nombre, p_apellido, p_email, fecha_nacimiento, p_telefono)
// Regresa: Un objeto JSON con el mensaje 'Usuario creado' o un error si falta algún campo o falla la conexión a la base de datos.
const crearUsuario = async (req, res) => {
  const { p_nombre, p_apellido, p_email, fecha_nacimiento, p_telefono } =
    req.body;

  // Verifica si faltan campos requeridos
  if (
    !p_nombre ||
    !p_apellido ||
    !p_email ||
    !fecha_nacimiento ||
    !p_telefono
  ) {
    return res.status(400).json({ error: "Llene todos los campos" });
  }

  // Consulta para llamar a la función almacenada y crear el usuario en la base de datos
  const query = "SELECT public.create_user($1, $2, $3, $4, $5) AS result";

  try {
    const { rows } = await db.query(query, [
      p_nombre,
      p_apellido,
      p_email,
      fecha_nacimiento,
      p_telefono,
    ]);

    // Si todo es correcto, se retorna el mensaje que devuelve la función
    res.status(201).json({ message: rows[0].result });
  } catch (err) {
    // Si hay un error en la consulta, se retorna un error 500 con el mensaje del error
    res.status(500).json({ error: err.message });
  }
};

// Función: Obtener todos los usuarios
// Descripción: Obtiene la lista completa de usuarios desde la base de datos usando un procedimiento almacenado.
// Recibe: Ningún dato, solo una solicitud GET.
// Regresa: Un objeto JSON con los datos de todos los usuarios obtenidos de la base de datos
const obtenerUsuarios = async (req, res) => {
  // Consulta para llamar a la función almacenada
  const query = "SELECT * FROM public.get_all_users()";

  try {
    // Ejecutar la consulta utilizando un cliente o pool
    const { rows } = await db.query(query);

    // Retornar la lista de usuarios obtenida
    res.status(200).json(rows);
  } catch (err) {
    // Manejo de errores en la consulta
    res.status(500).json({ error: err.message });
  }
};

// Función: Obtener un usuario por ID
// Descripción: Obtiene los datos de un usuario específico usando su ID.
// Recibe: req.params.id (ID del usuario a buscar)
// Regresa: Un objeto JSON con los datos del usuario encontrado, o un mensaje de error si no se encuentra.
const obtenerUsuarioPorId = async (req, res) => {
  const idusuario = req.params.id; // Obtener el ID desde los parámetros de la ruta

  // Consulta para llamar a la función almacenada
  const query = "SELECT * FROM public.get_user_by_id($1)";

  try {
    // Ejecutar la consulta utilizando un cliente o pool
    const { rows } = await db.query(query, [idusuario]);

    // Verificar si el usuario no fue encontrado
    if (!rows.length || !rows[0].id_usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Retornar los datos del usuario
    res.status(200).json(rows[0]);
  } catch (err) {
    // Manejo de errores en la consulta
    res.status(500).json({ error: err.message });
  }
};

// Función: Actualizar un usuario
// Descripción: Actualiza los datos de un usuario existente en la base de datos.
// Recibe: req.params.id (ID del usuario que se va a actualizar) y req.body (datos a actualizar: primer_nombre, segundo_nombre, etc.)
// Regresa: Un mensaje de éxito o error, dependiendo del resultado de la actualización.

const actualizarUsuario = async (req, res) => {
  const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la ruta
  const {
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    email,
    fecha_nacimiento,
    telefono
  } = req.body; // Extraer los datos del cuerpo de la solicitud

  // Preparar los datos que se pasarán a la función de PostgreSQL
  const datosParaActualizar = {
    id,
    primer_nombre: primer_nombre || null,
    segundo_nombre: segundo_nombre || null,
    primer_apellido: primer_apellido || null,
    segundo_apellido: segundo_apellido || null,
    email: email || null,
    fecha_nacimiento: fecha_nacimiento || null,
    telefono: telefono || null
  };

  // Consulta para llamar a la función de actualización
  const query = `SELECT public.update_user(
      $1, $2, $3, $4, $5, $6, $7, $8
    ) AS resultado`;

  try {
    // Ejecutar la consulta con los valores proporcionados
    const { rows } = await db.query(query, [
      datosParaActualizar.id,
      datosParaActualizar.email,
      datosParaActualizar.fecha_nacimiento,
      datosParaActualizar.telefono,
      datosParaActualizar.primer_nombre,
      datosParaActualizar.segundo_nombre,
      datosParaActualizar.primer_apellido,
      datosParaActualizar.segundo_apellido
    ]);

    // Validar el resultado de la función
    const resultado = rows[0].resultado;

    if (resultado.startsWith("Error")) {
      // Si la función retorna un error, enviar el mensaje de error
      return res.status(400).json({ error: resultado });
    }

    // Si todo salió bien, retornar un mensaje de éxito
    res.status(200).json({ message: resultado });
  } catch (err) {
    // Manejar errores en la consulta
    res.status(500).json({ error: err.message });
  }
};

module.exports = { actualizarUsuario };


// Función: Eliminar un usuario
// Descripción: Elimina un usuario de la base de datos usando su ID.
// Recibe: req.params.id (ID del usuario a eliminar)
// Regresa: Un mensaje de éxito si el usuario es eliminado correctamente.
const eliminarUsuario = async (req, res) => {
  const { id } = req.params; // Obtener el ID desde los parámetros de la ruta

  // Consulta para llamar a la función `public.delete_user_by_id`
  const query = `
    SELECT public.delete_user_by_id($1) AS resultado
  `;

  try {
    // Ejecutar la consulta con el ID proporcionado
    const { rows } = await db.query(query, [id]);

    // Obtener el resultado de la función
    const resultado = rows[0].resultado;

    if (resultado.startsWith("Error")) {
      // Si la función retorna un mensaje de error, devolverlo al cliente
      return res.status(400).json({ error: resultado });
    }

    // Si el usuario se eliminó con éxito, retornar el mensaje correspondiente
    res.status(200).json({ message: resultado });
  } catch (err) {
    // Manejar errores inesperados en la ejecución de la consulta
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
};
