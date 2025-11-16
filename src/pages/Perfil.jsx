import { Link } from "react-router";

export default function Perfil (){
    return(
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <h1>
                Pagina: Perfil
            </h1>
            {/*EN EL HEADEDR*/}
            <p>Regresar <Link to= "/Login">Login</Link></p>

            {/*EN EL MAIN*/}
            <p>Regresar a <Link to="/">Home</Link></p>
        </div>
    )
}