import { useNavigation } from "../context/NavigationContext";
import { useNavigate } from "react-router";

export default function ReturnButton() {
    const { previousPath } = useNavigation();
    const navigate = useNavigate();
    return(
        <span>
            {previousPath && (
                <button onClick={() => navigate(previousPath)}>
                    ⬅ Regresar
                </button>
            )}
        </span>
    )
}