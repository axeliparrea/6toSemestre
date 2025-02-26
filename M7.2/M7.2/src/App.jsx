import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Contacto from "../pages/Contacto.jsx"; 

const App = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <Routes>
      {/* Página de login */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/contacto" element={isAuthenticated ? <Contacto /> : <Navigate to="/login" />} />

      {/* Redirigir cualquier ruta no válida al login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
