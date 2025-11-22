import { Link } from "react-router";
import Header from "../Components/Header";

import { useEffect, useState } from "react";

export default function Home() {

  // Estado para guardar el equipo
  const [equipment, setEquipment] = useState([]);

  // Llamar al backend al cargar la página
  useEffect(() => {
    fetch("http://localhost:5000/api/equipment")
      .then(res => res.json())
      .then(data => setEquipment(data))
      .catch(err => console.log("Error al obtener equipo:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>

      {/*EN EL HEADEDR*/}
      <Header />

      <div style={{ textAlign: "center", marginTop: "6rem" }}>
        <h1>
          Pagina : Home
        </h1>
        {/*EN EL MAIN*/}
        <p>Ir a <Link to="/Equipo">Equipo</Link></p>
        <p>Ir a <Link to="/Rooms">Rooms</Link></p>

        {/* LISTA DE EQUIPO AQUÍ DEBAJO */}
        <h2 style={{ marginTop: "3rem" }}>Equipo Disponible</h2>
        
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "1rem",
          gap: "20px"
        }}>
          {equipment.map(item => (
            <div key={item._id} style={{
              border: "1px solid #ccc",
              padding: "1rem",
              width: "200px",
              borderRadius: "8px"
            }}>
              <h3>{item.name}</h3>
              <p>Tipo: {item.type}</p>
              <p style={{ color: item.available ? "green" : "red" }}>
                {item.available ? "Disponible" : "No disponible"}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}