import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const location = useLocation();

  const [previousPath, setPreviousPath] = useState(null);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Usamos useRef para evitar bucles al actualizar estado
  const lastPathRef = useRef(location.pathname);

  useEffect(() => {
    // Cada vez que cambie la ruta:
    // previous = el valor anterior de lastPathRef
    setPreviousPath(lastPathRef.current);

    // current = location.pathname
    setCurrentPath(location.pathname);

    // Actualizamos la referencia para la próxima navegación
    lastPathRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <NavigationContext.Provider
      value={{
        previousPath,
        currentPath,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

// Hook para usar el contexto desde cualquier componente
export function useNavigation() {
  return useContext(NavigationContext);
}
