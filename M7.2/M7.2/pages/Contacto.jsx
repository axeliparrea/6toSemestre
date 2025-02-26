import React from "react";
import { Container, Typography, TextField, Button, Box, Card, CardContent } from "@mui/material";

const Contacto = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Card sx={{ p: 3, width: "100%", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom textAlign="center">
              Contacto
            </Typography>

            {/* Información de contacto */}
            <Typography variant="h6" color="primary">
              Axel Iparrea
            </Typography>
            <Typography>Email: axel2202@gmail.com</Typography>
            <Typography>Teléfono: +52 811-345-6789</Typography>

            {/* Formulario de contacto */}
            <Box component="form" sx={{ mt: 3 }}>
              <TextField fullWidth label="Tu Nombre" variant="outlined" margin="normal" />
              <TextField fullWidth label="Tu Email" variant="outlined" margin="normal" />
              <TextField fullWidth label="Mensaje" multiline rows={4} variant="outlined" margin="normal" />
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Enviar Mensaje
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Contacto;
