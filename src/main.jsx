import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { BrowserRouter } from "react-router-dom"; // ← Agregar esto
//import { AuthProvider } from "./context/AuthContext";


import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";

const clientId = "214318872208-7v451lsctr80imd081j34f4u98fe7ip6.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <GoogleOAuthProvider clientId={clientId}>

      <BrowserRouter> {/* ← Router aquí */}
        <AuthProvider> {/* ← AuthProvider dentro del Router */}
          <App />
        </AuthProvider>
      </BrowserRouter>

    </GoogleOAuthProvider>
    
  </React.StrictMode>
);