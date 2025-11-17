import { Link } from "react-router";


export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>
        Pagina : Home
    </h1>
        {/*EN EL HEADEDR*/}
        <p>Regresar <Link to= "/Login">Login</Link></p>
        <p>Ir a <Link to= "/Perfil">Perfil</Link></p>

        {/*EN EL MAIN*/}
        <p>Ir a <Link to= "/Equipo">Equipo</Link></p>
        <p>Ir a <Link to= "/Rooms">Rooms</Link></p>
    </div>
  );
}