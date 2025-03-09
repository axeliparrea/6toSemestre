// import { AppBar, Toolbar, Button } from "@mui/material";
// import { Link } from "react-router-dom";

// const NavBar = ({ isAuthenticated }) => {
//   const handleLogout = () => {
//     localStorage.removeItem("isAuthenticated");
//     window.location.href = "/login";
//   };

//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Button color="inherit" component={Link} to="/">Inicio</Button>
//         {isAuthenticated && <Button color="inherit" component={Link} to="/contacto">Contacto</Button>}
//         {isAuthenticated ? (
//           <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
//         ) : (
//           <Button color="inherit" component={Link} to="/login">Login</Button>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default NavBar;
