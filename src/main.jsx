import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
//import { AuthProvider } from "./context/AuthContext";
import './index.css'
import App from './App.jsx'

const clientId = "214318872208-7v451lsctr80imd081j34f4u98fe7ip6.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <GoogleOAuthProvider clientId={clientId}>
   
      <App />
     
    </GoogleOAuthProvider>
    
  </React.StrictMode>
);
