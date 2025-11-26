import { BrowserRouter, Routes, Route } from "react-router";
import { NavigationProvider } from "./context/NavigationContext";
import { AuthProvider } from "./context/AuthContext"

import Home from './pages/Home';
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Equipo from "./pages/Equipo";
import Rooms from "./pages/Rooms";

function App() {
  

  return (
     
    <BrowserRouter>
    <AuthProvider>
    <NavigationProvider>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Equipo" element={<Equipo />} />
        <Route path="/Rooms" element={<Rooms />} />
      </Routes>
      </NavigationProvider>
      </AuthProvider>
    </BrowserRouter>
     
  )
}

export default App