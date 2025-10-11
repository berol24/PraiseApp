import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });

export  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce chant ?")) return;

    try {
       const token = localStorage.getItem("token");
      await api.delete(`/api/chants/${id}`,{
        headers: { Authorization: `Bearer ${token}` }
      });
      // Rafraîchir la liste après suppression
      fetchChants();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("Erreur lors de la suppression, veuillez réessayer.");
    }
  };