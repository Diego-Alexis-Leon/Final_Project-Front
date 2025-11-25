/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (res) => {
      const info = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${res.access_token}` },
      });
      const data = await info.json();
      setUser(data);
      navigate("/Home");
    },
  });

  const logout = () => {
    googleLogout();
    setUser(null);
    setRole(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
