import Header from "../Components/Header";
import ReturnButton from "../Components/ReturnButton";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Perfil() {
    const { user, role } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        const fetchReservations = async () => {
            try {
                let endpoint = "http://localhost:5000/api/reservations/my";
                
                // Si es admin, obtener TODAS las reservas
                if (role === "admin") {
                    endpoint = "http://localhost:5000/api/reservations/all";
                }

                const res = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setReservations(res.data);
            } catch (err) {
                console.log("Error fetching reservations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [role]);

    // Función para formatear la fecha/hora
    const formatDateTime = (reservation) => {
        if (reservation.resourceType === "room") {
            return `${reservation.day} ${reservation.startHour} - ${reservation.endHour}`;
        } else {
            const start = new Date(reservation.startDate).toLocaleString();
            const end = new Date(reservation.endDate).toLocaleString();
            return `${start} — ${end}`;
        }
    };

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
                        <div style={{ marginTop: "1rem" }}>
                            <span style={{
                                padding: "0.3rem 0.8rem",
                                borderRadius: "20px",
                                background: role === "admin" ? "#8A1538" : "#7a0d26",
                                color: "white",
                                fontSize: "0.8rem",
                                fontWeight: "bold"
                            }}>
                                {role === "admin" ? "ADMINISTRADOR" : "ALUMNO"}
                            </span>
                        </div>
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
                        <p><strong>Rol:</strong> {role === "admin" ? "Administrador" : "Alumno"}</p>

                        <h3 style={{ marginTop: "2rem" }}>
                            {role === "admin" ? "Todas las Reservas" : "Mis Reservas"}
                        </h3>

                        {/* LISTA DE RESERVAS */}
                        <div style={{
                            height: "300px",
                            overflowY: "auto",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "1rem",
                            background: "#f9f9f9"
                        }}>
                            {loading ? (
                                <p style={{ textAlign: "center" }}>Cargando reservas...</p>
                            ) : reservations.length === 0 ? (
                                <p style={{ textAlign: "center", color: "#666" }}>
                                    {role === "admin" 
                                        ? "No hay reservas en el sistema" 
                                        : "No tienes reservas activas"
                                    }
                                </p>
                            ) : (
                                reservations.map(r => (
                                    <div key={r._id} style={{
                                        padding: "1rem",
                                        marginBottom: "0.8rem",
                                        background: "white",
                                        borderRadius: "8px",
                                        border: "1px solid #e0e0e0"
                                    }}>
                                        <p style={{ margin: "0 0 0.5rem 0" }}>
                                            <strong>{r.resourceType.toUpperCase()}: </strong>
                                            {r.resourceId?.name || "Recurso no disponible"}
                                        </p>
                                        <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                            {formatDateTime(r)}
                                        </p>
                                        <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                            <strong>Estado:</strong> 
                                            <span style={{ 
                                                color: r.status === "approved" ? "green" : 
                                                       r.status === "pending" ? "orange" : "red",
                                                fontWeight: "bold",
                                                marginLeft: "0.5rem"
                                            }}>
                                                {r.status === "approved" ? "Aprobado" : 
                                                 r.status === "pending" ? "Pendiente" : "Rechazado"}
                                            </span>
                                        </p>
                                        {role === "admin" && r.user && (
                                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                                                <strong>Solicitante:</strong> {r.user.name} ({r.user.email})
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}