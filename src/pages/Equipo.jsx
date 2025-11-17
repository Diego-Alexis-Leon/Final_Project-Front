import { Link } from "react-router";

export default function Equipo() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>
        Pagina : Equipo
    </h1>
        {/*EN EL HEADEDR*/}
        <p>Ir a <Link to= "/Perfil">Perfil</Link></p>
        <p>Regresar <Link to= "/Login">Login</Link></p>

        {/*EN EL MAIN*/}
        <p>Ir a <Link to= "/">Home</Link></p>
        
    </div>
  );
}