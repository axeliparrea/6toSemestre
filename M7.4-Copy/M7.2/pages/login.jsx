import { useState} from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
    setSuccess("");
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor complete todos los campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        email: username,
        password,
      });
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
      } else {
        setError("Respuesta inesperada del servidor");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err.response?.data);
      setError(err.response?.data?.message || "Credenciales incorrectas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !newPassword) {
      setError("Por favor complete todos los campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:3000/users/register", {
        name,
        email,
        password: newPassword,
      });
      setSuccess("Usuario registrado correctamente. Ya puede iniciar sesión.");
      setActiveTab(0);
    } catch (err) {
      console.error("Error al registrar usuario:", err.response?.data);
      setError(err.response?.data?.message || "Error al registrar usuario. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userIdToDelete) {
      setError("Por favor ingrese el ID del usuario a eliminar");
      return;
    }
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:3000/users/${userIdToDelete}`);
      setSuccess("Usuario eliminado exitosamente");
      setUserIdToDelete("");
    } catch (err) {
      console.error("Error al eliminar usuario:", err.response?.data);
      setError("Error al eliminar el usuario. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        sx={{
          width: "100%",
          p: 3,
          boxShadow: 5,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <CardContent>
          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
            <Tab label="Iniciar Sesión" />
            <Tab label="Registrarse" />
          </Tabs>
          {activeTab === 0 ? (
            <Box>
              <Avatar
                sx={{
                  m: "auto",
                  bgcolor: "primary.main",
                  width: 56,
                  height: 56,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" color="primary" fontWeight="bold" mt={2} mb={3}>
                Iniciar Sesión
              </Typography>
              <TextField
                fullWidth
                label="Usuario"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Ingresar"}
              </Button>
              {error && (
                <Typography variant="body2" color="error" mt={2}>
                  {error}
                </Typography>
              )}
              <Typography variant="body2" mt={2} color="text.secondary">
                ¿Olvidaste tu contraseña?{" "}
                <a href="#" style={{ color: "#1976d2", textDecoration: "none" }}>
                  Recupérala aquí
                </a>
              </Typography>
            </Box>
          ) : (
            <Box>
              <Avatar
                sx={{
                  m: "auto",
                  bgcolor: "secondary.main",
                  width: 56,
                  height: 56,
                }}
              >
                <PersonAddIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" color="secondary" fontWeight="bold" mt={2} mb={3}>
                Registrarse
              </Typography>
              <TextField
                fullWidth
                label="Nombre"
                variant="outlined"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                variant="outlined"
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Registrarse"}
              </Button>
              {error && (
                <Typography variant="body2" color="error" mt={2}>
                  {error}
                </Typography>
              )}
              {success && (
                <Typography variant="body2" color="success.main" mt={2}>
                  {success}
                </Typography>
              )}
            </Box>
          )}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" color="error">
              Eliminar Usuario
            </Typography>
            <TextField
              fullWidth
              label="ID del Usuario a Eliminar"
              variant="outlined"
              margin="normal"
              value={userIdToDelete}
              onChange={(e) => setUserIdToDelete(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 2,
              }}
              onClick={handleDeleteUser}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <DeleteIcon /> Eliminar Usuario
                </>
              )}
            </Button>
            {error && (
              <Typography variant="body2" color="error" mt={2}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography variant="body2" color="success.main" mt={2}>
                {success}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginRegister;
