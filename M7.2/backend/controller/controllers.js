const { sql, poolPromise } = require("../config/dataBase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password, username } = req.body;

  // Validar que todos los campos requeridos están presentes
  if (!name || !email || !password || !username) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const pool = await poolPromise;

    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el usuario en la tabla Users
    const userResult = await pool
      .request()
      .input("Name", sql.NVarChar(100), name)
      .input("Email", sql.NVarChar(255), email)
      .query("INSERT INTO dbo.Users (Name, Email) OUTPUT INSERTED.Id VALUES (@Name, @Email)");

    const userId = userResult.recordset[0].Id; // Obtener el ID del usuario recién insertado

    // Insertar el login en la tabla Login
    await pool
      .request()
      .input("Username", sql.NVarChar(100), username)
      .input("PasswordHash", sql.NVarChar(255), hashedPassword)
      .input("UserId", sql.Int, userId)
      .query("INSERT INTO dbo.Login (UserId, Username, PasswordHash) VALUES (@UserId, @Username, @PasswordHash)");

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validar que todos los campos requeridos están presentes
  if (!username || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const pool = await poolPromise;

    // Buscar el usuario en la tabla Login usando el username
    const result = await pool
      .request()
      .input("Username", sql.NVarChar(100), username)
      .query("SELECT l.UserId, l.Username, l.PasswordHash, u.Name FROM dbo.Login l INNER JOIN dbo.Users u ON l.UserId = u.Id WHERE l.Username = @Username");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = result.recordset[0];
    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

    // Verificar si la contraseña coincide con la almacenada
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Crear un token JWT
    const token = jwt.sign({ id: user.UserId, name: user.Name }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const getUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT Id, Name, Email, CreatedAt FROM dbo.Users");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  // Validar que al menos un campo sea proporcionado para actualizar
  if (!name && !email && !password) {
    return res.status(400).json({ error: "Debe proporcionar al menos un campo (nombre, correo o contraseña)" });
  }

  try {
    const pool = await poolPromise;
    const updateQuery = [];

    // Construir el query de actualización
    if (name) updateQuery.push("Name = @Name");
    if (email) updateQuery.push("Email = @Email");
    if (password) updateQuery.push("PasswordHash = @PasswordHash");

    if (updateQuery.length === 0) {
      return res.status(400).json({ error: "No hay campos válidos para actualizar" });
    }

    const query = `UPDATE dbo.Users SET ${updateQuery.join(", ")} WHERE Id = @Id`;

    const request = pool.request().input("Id", sql.Int, id);
    if (name) request.input("Name", sql.NVarChar(100), name);
    if (email) request.input("Email", sql.NVarChar(255), email);
    if (password) request.input("PasswordHash", sql.NVarChar(255), await bcrypt.hash(password, 10));

    await request.query(query);
    res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request().input("Id", sql.Int, id).query("DELETE FROM dbo.Users WHERE Id = @Id");

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = { registerUser, loginUser, getUsers, updateUser, deleteUser };
