import api from "./api";
import { toast } from "./toast";

export const handleDeleteUser = async (id, navigate, fetchUsers) => {
  try {
    await api.delete(`/api/users/${id}`);
    toast("Utilisateur supprimé avec succès !", "success");
    navigate("/admin");
    fetchUsers();
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    toast("Erreur lors de la suppression, veuillez réessayer.", "error");
  }
};
