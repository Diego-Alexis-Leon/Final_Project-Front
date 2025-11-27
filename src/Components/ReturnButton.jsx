import { useNavigate } from "react-router";
import { useNavigation } from "../context/NavigationContext";

export default function ReturnButton() {
    const navigate = useNavigate();
    const { previousPath } = useNavigation();
    
    return(
        <span>
            {previousPath && (
                <button 
                    onClick={() => navigate(previousPath)}
                    className="bg-[#8A1538] text-white px-4 py-2 rounded-lg hover:bg-[#6a102c] transition-colors duration-200 font-medium shadow-sm"
                >
                    Regresar
                </button>
            )}
        </span>
    )
}
