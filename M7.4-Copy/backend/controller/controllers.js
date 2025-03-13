require('dotenv').config();

const { sql, poolPromise } = require("../config/dataBase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const pool = await poolPromise;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool
    .request()
    .input("Name", sql.NVarChar(100), name)
    .input("Email", sql.NVarChar(255), email)
    .input("PasswordHash", sql.NVarChar(255), hashedPassword)
    .query("INSERT INTO dbo.Users (Name, Email, PasswordHash) VALUES (@Name, @Email, @PasswordHash)");

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Email", sql.NVarChar(255), email)
      .query("SELECT Id, Name, Email, PasswordHash FROM dbo.Users WHERE Email = @Email");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = result.recordset[0];

    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user.Id, name: user.Name }, process.env.JWT_SECRET, { expiresIn: "1h" });

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

  if (!name && !email && !password) {
    return res.status(400).json({ error: "Debe proporcionar al menos un campo (nombre, correo o contraseña)" });
  }

  try {
    const pool = await poolPromise;

    if (name || email) {
      let updateQuery = [];
      if (name) updateQuery.push("Name = @Name");
      if (email) updateQuery.push("Email = @Email");

      const userRequest = pool.request().input("Id", sql.Int, id);
      if (name) userRequest.input("Name", sql.NVarChar(100), name);
      if (email) userRequest.input("Email", sql.NVarChar(255), email);

      await userRequest.query(`UPDATE dbo.Users SET ${updateQuery.join(", ")} WHERE Id = @Id`);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool
        .request()
        .input("UserId", sql.Int, id)
        .input("PasswordHash", sql.NVarChar(255), hashedPassword)
        .query("UPDATE dbo.Users SET PasswordHash = @PasswordHash WHERE Id = @UserId");
    }

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
