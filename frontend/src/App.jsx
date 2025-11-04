import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import InstallerButton from "./components/InstallerButton";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Charger l’utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/showChants");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <InstallerButton />
      <Outlet context={{ user, handleLogin, handleLogout }} />
    </>
  );
}
