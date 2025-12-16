
import api from "./api";

export const handleDelete = async (id,navigate,fetchChants) => {


  if (!window.confirm("Voulez-vous vraiment supprimer ce chant ?")) return;

  try {
    await api.delete(`/api/chants/${id}`);

    navigate("/showChants");
    fetchChants();
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    alert("Erreur lors de la suppression, veuillez réessayer.");
  }
};
