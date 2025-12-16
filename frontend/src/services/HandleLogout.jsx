
import { removeToken } from "./authService";

export const handleLogout = (navigate) => {
  try {
    localStorage.removeItem("user");
    removeToken();
    navigate("/login");
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};
