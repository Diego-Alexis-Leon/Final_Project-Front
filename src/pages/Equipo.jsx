import { Link } from "react-router";

import Header from "../Components/Header";
import ReturnButton from "../Components/ReturnButton";

export default function Equipo() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      
      <Header />

      <div style={{ textAlign: "center", marginTop: "6rem" }}>
      <ReturnButton />
      <h1>
        Pagina : Equipo
      </h1>
      </div>
    </div>
  );
}