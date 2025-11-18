import { Link } from "react-router";
import Header from "../Components/Header";
import ReturnButton from "../Components/ReturnButton";

export default function Rooms() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <Header />
      <div style={{ textAlign: "center", marginTop: "6rem" }}>
      <ReturnButton />
      <h1>
        Pagina : Rooms
      </h1>
      </div>
    </div>
  );
}