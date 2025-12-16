import api from "./api";

export const handleDeleteUser = async (id,navigate,fetchUsers) => {

  if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

  try {
    await api.delete(`/api/users/${id}`);

    navigate("/admin");
    fetchUsers();
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    alert("Erreur lors de la suppression, veuillez réessayer.");
  }
};
