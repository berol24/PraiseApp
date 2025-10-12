
export const handleLogout = (navigate) => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};
