import { Link } from "react-router";
import Header from "../Components/Header";
import { useEffect, useState } from "react";

export default function Home() {

  const [equipment, setEquipment] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/equipment")
      .then(res => res.json())
      .then(data => setEquipment(data))
      .catch(err => console.log("Error al obtener equipo:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then(res => res.json())
      .then(data => setRooms(data));
  }, []);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('/src/assets/fondo.jpg')` }}
    >
      {/* HEADER */}
      <Header />

      <div className="text-center pt-24 pb-12">
        
        <h1 className="text-3xl font-bold mb-6 text-white">
          BIENVENDIDOS
        </h1>

        {/* BOTONES MODIFICADOS */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <Link
            to="/Equipo"
            className="px-12 py-6 bg-[#8A1538] text-white rounded-2xl hover:bg-[#6a102a] transition-all shadow-lg text-xl font-semibold min-w-64 text-center"
          >
            Equipo
          </Link>

          <Link
            to="/Rooms"
            className="px-12 py-6 bg-[#8A1538] text-white rounded-2xl hover:bg-[#6a102a] transition-all shadow-lg text-xl font-semibold min-w-64 text-center"
          >
            Rooms
          </Link>
        </div>

        {/* LISTA EQUIPO */}
        <div className="bg-white/90 backdrop-blur-sm mx-6 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Equipo Disponible</h2>

          <div className="flex justify-center flex-wrap gap-6">
            {equipment.map(item => (
              <div
                key={item._id}
                className="w-52 p-4 border rounded-xl shadow-sm bg-white"
              >
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-gray-600">Tipo: {item.type}</p>

                <p
                  className={`font-semibold mt-2 ${item.available ? "text-green-600" : "text-red-600"}`}
                >
                  {item.available ? "Disponible" : "No disponible"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* LISTA ROOMS */}
        <div className="bg-white/90 backdrop-blur-sm mx-6 rounded-2xl p-6 shadow-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Cuartos Disponibles</h2>

          <div className="flex justify-center flex-wrap gap-6">
            {rooms.map(room => (
              <div
                key={room._id}
                className="w-52 p-4 border rounded-xl shadow-sm bg-white"
              >
                <h3 className="text-lg font-bold">{room.name}</h3>
                <p className="text-gray-600">Capacidad: {room.capacity}</p>

                <p
                  className={`font-semibold mt-2 ${room.available ? "text-green-600" : "text-red-600"}`}
                >
                  {room.available ? "Disponible" : "Ocupado"}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}