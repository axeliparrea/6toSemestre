import React, { useState } from "react";
import { 
  TextField, Button, Container, Typography, Card, 
  CardContent, Box, Avatar 
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    window.location.href = "/";
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
          >
            Ingresar
          </Button>

          <Typography variant="body2" mt={2} color="text.secondary">
            ¿Olvidaste tu contraseña? <a href="#" style={{ color: "#1976d2", textDecoration: "none" }}>Recupérala aquí</a>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
