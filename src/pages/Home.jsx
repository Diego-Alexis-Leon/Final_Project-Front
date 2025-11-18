import { Link } from "react-router";
import Header from "../Components/Header";

export default function Home() {
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
      </div>
    </div>
  );
}