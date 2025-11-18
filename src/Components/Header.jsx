import { Link , useLocation } from "react-router";

export default function Header() {
    const location = useLocation();
    const isPerfil = location.pathname === "/Perfil";

    return (
        <header
            style={{
                width: "100%",
                padding: "1rem 2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#660000", // rojo oscuro
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1000,
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                color: "white"
            }}
        >
            <h2 style={{ margin: 0 }}>Universidad Panamericana</h2>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                
                {/* Botón Logout estilizado */}
                <Link to="/Login">
                    <button
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#e0e0e0", // gris claro
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Logout
                    </button>
                </Link>

                {/* Botón Perfil circular con imagen */}
                {!isPerfil && (
                    <Link to="/Perfil">
                        <button
                            style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "2px solid #ffffff",
                                cursor: "pointer",
                                padding: 0
                            }}
                        >
                            <img
                                src="https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" 
                                alt="Perfil"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
}
