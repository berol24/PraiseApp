/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { setToken as saveToken, getToken, removeToken, isTokenExpired } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setTokenState] = useState(() => getToken());

  useEffect(() => {
    function check() {
      const t = getToken();
      if (t && isTokenExpired(t)) {
        // token expired -> logout
        removeToken();
        setTokenState(null);
        setUser(null);
        try { window.location.href = "/login"; } catch { }
      }
    }
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onOffline() {
      // could set a global state for offline
    }
    window.addEventListener("offline", onOffline);
    return () => window.removeEventListener("offline", onOffline);
  }, []);

  function handleLogin(newToken, newUser) {
    saveToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  function handleLogout(redirect = true) {
    removeToken();
    setTokenState(null);
    setUser(null);
    localStorage.removeItem("user");
    if (redirect) {
      try { window.location.href = "/login"; } catch { }
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
