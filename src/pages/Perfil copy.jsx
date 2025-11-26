import Header from "../Components/Header";
import ReturnButton from "../Components/ReturnButton";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Perfil() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get("http://localhost:5000/api/reservations/my", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setReservations(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <Header />

            <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>

                {/* CONTENEDOR PRINCIPAL */}
                <div style={{
                    width: "90%",
                    maxWidth: "1000px",
                    display: "grid",
                    gridTemplateColumns: "250px 1fr",
                    gap: "2rem",
                    padding: "2rem",
                    borderRadius: "10px"
                }}>

                    {/* FOTO */}
                    <div style={{
                        background: "#f1f1f1",
                        padding: "1rem",
                        borderRadius: "10px",
                        textAlign: "center"
                    }}>
                        <img
                            src={user?.picture}
                            alt="profile"
                            style={{ width: "100%", borderRadius: "10px" }}
                        />
                    </div>

                    {/* DATOS */}
                    <div style={{ textAlign: "left" }}>
                        <ReturnButton />
                        <h2 style={{ marginTop: "1rem", textAlign: "center" }}>
                            Hola de nuevo {user?.name}
                        </h2>

                        <p><strong>Nombre:</strong> {user?.name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Carrera:</strong> {user?.career || "No asignada"}</p>

                        <h3 style={{ marginTop: "2rem" }}>Requests:</h3>

                        {/* LISTA DE RESERVAS — temporal */}
                        <div style={{
                            height: "200px",
                            overflowY: "auto",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "1rem"
                        }}>
                            {reservations.map(r => (
                                <div key={r._id} style={{
                                    padding: "0.8rem",
                                    marginBottom: "0.5rem",
                                    background: "#eee",
                                    borderRadius: "8px"
                                }}>
                                    <p><strong>{r.resourceType.toUpperCase()}</strong></p>
                                    <p>{new Date(r.startDate).toLocaleString()} — {new Date(r.endDate).toLocaleString()}</p>
                                    <p>Status: {r.status}</p>
                                </div>
                            ))}
                        </div>
                        {/* LISTA DE RESERVAS — temporal 
                        <p style={{ marginTop: "2rem" }}>
                            Regresar a <Link to="/Home">Home</Link>
                        </p>
                        */}
                    </div>
                </div>
            </div>
        </div>
    );
}
