import { Routes, Route } from "react-router";
import { NavigationProvider } from "./context/NavigationContext";
// Quitar AuthProvider de aquí

import Home from './pages/Home';
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Equipo from "./pages/Equipo";
import Rooms from "./pages/Rooms";

function App() {
  return (

    <NavigationProvider>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Equipo" element={<Equipo />} />
        <Route path="/Rooms" element={<Rooms />} />
      </Routes>
    </NavigationProvider>

  )
}

export default App