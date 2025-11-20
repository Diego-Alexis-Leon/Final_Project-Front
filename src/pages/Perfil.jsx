import { Link } from "react-router";


import Header from "../Components/Header";
import ReturnButton from "../Components/ReturnButton";

export default function Perfil() {
    return (
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <Header />

            {/*EN EL MAIN*/}
            <div style={{ textAlign: "center", marginTop: "6rem" }}>
            <ReturnButton/>
            <h1>
                Pagina: Perfil
            </h1>
            
            <p>Regresar a <Link to="/Home">Home</Link></p>
            </div>
        </div>
    )
}