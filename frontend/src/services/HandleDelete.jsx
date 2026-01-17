import api from "./api";
import { toast } from "./toast";

export const handleDelete = async (id, navigate, fetchChants) => {
  try {
    await api.delete(`/api/chants/${id}`);
    toast("Chant supprimé avec succès !", "success");
    navigate("/showChants");
    fetchChants();
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    toast("Erreur lors de la suppression, veuillez réessayer.", "error");
  }
};
