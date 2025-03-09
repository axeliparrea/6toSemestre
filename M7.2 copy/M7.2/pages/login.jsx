import React, { useState } from "react";
import axios from "axios";
import { 
  TextField, Button, Container, Typography, Card, 
  CardContent, Avatar, CircularProgress 
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/login", { username, password });

      const token = response.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");

      window.location.href = "/";
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Credenciales incorrectas o error de conexión.");
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
        height: "100vh" 
      }}
    >
      <Card 
        sx={{ 
          width: "100%", 
          p: 3, 
          boxShadow: 5, 
          borderRadius: 4, 
          textAlign: "center" 
        }}
      >
        <CardContent>
          {/* Ícono de usuario */}
          <Avatar sx={{ 
            m: "auto", 
            bgcolor: "primary.main", 
            width: 56, 
            height: 56 
          }}>
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>

          <Typography variant="h4" color="primary" fontWeight="bold" mt={2}>
            Iniciar Sesión
          </Typography>

          <TextField 
            fullWidth 
            label="Usuario" 
            variant="outlined" 
            margin="normal" 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <TextField 
            fullWidth 
            label="Contraseña" 
            type="password" 
            variant="outlined" 
            margin="normal" 
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
              borderRadius: 2
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
            ¿Olvidaste tu contraseña? <a href="#" style={{ color: "#1976d2", textDecoration: "none" }}>Recupérala aquí</a>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
