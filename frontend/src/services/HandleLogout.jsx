export const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };