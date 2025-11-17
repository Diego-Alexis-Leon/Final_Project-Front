import { useNavigate, Link } from "react-router";

export default function Login() {
  

  return (
    <form style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>
        Pagina : Login
      </h1>
        {/*EN EL MAIN*/}
      <p>Ir a <Link to= "/">Home</Link></p>
      
    </form>
  );
}
