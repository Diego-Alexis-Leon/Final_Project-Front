import React from "react";

import { useAuth } from "../context/AuthContext.jsx";
//import { useAuth } from "../context/authContext";

export default function Login() {
  const { login, setRole } = useAuth();

  // Cuando se hace clic en ADMIN o ALUMNO
  const handleLogin = (role) => {
    setRole(role);
    login(); // Esto viene del AuthContext
  };

  

  return (
    <div className="relative">

      {/*Universidad Panamericana*/}
      <div className="absolute top-0 left-0 flex items-center gap-3 m-4">
        <h2 className="text-left">
          UNIVERSIDAD PANAMERICANA<br />ESCUELA DE COMUNICACIÓN
        </h2>
      </div>

      <form className="pt-32">

        {/* El cuadrado de Login */}
        <div className="mx-auto mt-10 p-10 w-[500px] bg-gray-100 rounded-2xl shadow-md">
          <h1 className="text-4xl tracking-widest text-center mb-10">LOGIN</h1>

          <div className="flex flex-col gap-8">

            <div>
              <label className="block bg-gray-300 px-4 py-2 w-fit tracking-widest text-sm">
                USERNAME
              </label>
              <input
                type="text"
                className="w-full bg-gray-200 mt-2 p-3 rounded shadow-sm outline-none"
              />
            </div>

            <div>
              <label className="block bg-gray-300 px-4 py-2 w-fit tracking-widest text-sm">
                PASSWORD
              </label>
              <input
                type="password"
                className="w-full bg-gray-200 mt-2 p-3 rounded shadow-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Botones de ADMIN y ALUMNO */}
        <div className="flex gap-6 justify-center mt-10">
          <button
            type="button"
            onClick={() => handleLogin("admin")}
            className="block bg-[#8A1538] px-8 py-6 w-fit tracking-widest text-sm rounded-2xl text-white"
          >
            SOY ADMIN
          </button>

          <button
            type="button"
            onClick={() => handleLogin("alumno")}
            className="block bg-[#8A1538] px-8 py-6 w-fit tracking-widest text-sm rounded-2xl text-white"
          >
            SOY ALUMNO
          </button>
        </div>
      </form>
    </div>
  );
}

