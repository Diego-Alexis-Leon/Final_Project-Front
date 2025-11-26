import { useNavigate } from "react-router";

export default function ReturnButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="
                inline-flex items-center
                px-4 py-2
                rounded-md
                bg-[#8A1538]
                text-white
                font-medium
                shadow-md
                hover:bg-[#6f0f2a]
                transition-colors
            "
        >
            Regresar
        </button>
    );
}
