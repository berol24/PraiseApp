import { useEffect, useState } from "react";
import axios from "axios";
import AddChant from "./AddChant";
import { Link, useNavigate } from "react-router-dom";
import { handleDelete } from "../services/HandleDelete";
import Header from "../components/Header";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });

export default function ShowChant() {
  const [user, setUser] = useState(null);
  const [chants, setChants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChants, setFilteredChants] = useState([]);
  const [favoris, setFavoris] = useState([]); // liste locale des favoris

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/login");
    setUser(JSON.parse(storedUser));
    fetchChants();
  }, []);

  const fetchChants = async () => {
    try {
      const res = await api.get("/api/chants");
      setChants(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des chants", err);
    }
  };

  //  Filtrage automatique à chaque saisie
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = chants.filter(
      (chant) =>
        chant.titre?.toLowerCase().includes(term) ||
        chant.auteur?.toLowerCase().includes(term)
    );
    setFilteredChants(filtered);
  }, [searchTerm, chants]);

  useEffect(() => {
    fetchFavoris();
  }, [user]);

  const fetchFavoris = async () => {
    if (!user) return;
    try {
      const res = await api.get("/favoris", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setFavoris(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des favoris", err);
    }
  };

  //  Ajouter ou retirer un favori
  const handleFavori = async (chantId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await api.post(
        `/api/favoris/${chantId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchFavoris();
    } catch (err) {
      console.error("Erreur favoris :", err);
    }
  };

  // Vérifier si un chant est en favoris
  const isFavori = (chantId) => favoris.some((f) => f._id === chantId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        navigate={navigate}
        user={user}
        number_chants={filteredChants.length}
      />
      {/* Contenu principal */}
      <main className="container mx-auto p-6 sm:p-8 md:p-10 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          {/* Champ de recherche */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un chant ..."
            className="w-full sm:w-64 border border-gray-400 rounded-lg py-2 px-3 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* Bouton Ajouter pour admin */}
          {(user?.role === "admin" || user?.role === "manager") && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg transition w-full sm:w-auto"
            >
              + Ajouter un chant
            </button>
          )}{" "}
        </div>

        {/* Formulaire d'ajout si actif */}
        {showAddForm && (
          <AddChant
            onClose={() => setShowAddForm(false)}
            onAdded={fetchChants}
          />
        )}

        {/* Grille des chants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChants.length > 0 ? (
            filteredChants.map((c) => (
              <a href={`/showChants/${c._id}`} key={c._id} className="block">
                <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col justify-between cursor-pointer hover:shadow-xl transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 mb-2">
                        {c.titre}
                      </h3>
                      <p className="text-gray-500 italic mb-4">
                        Auteur : {c.auteur || "Inconnu"}
                      </p>
                    </div>

                    {/* ⭐ Bouton Favori */}
                    {user && (
                      <button
                        onClick={(e) => handleFavori(c._id, e)}
                        className="text-yellow-500 hover:text-yellow-600 text-2xl transition"
                        title={
                          isFavori(c._id)
                            ? "Retirer des favoris"
                            : "Ajouter aux favoris"
                        }
                      >
                        {isFavori(c._id) ? "★" : "☆"}
                      </button>
                    )}
                  </div>

                  {(user?.role === "admin" || user?.role === "manager") && (
                    <div className="flex space-x-4">
                      <Link
                        to={`/editChant/${c._id}`}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Éditer
                      </Link>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(c._id, navigate, fetchChants);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </a>
            ))
          ) : (
            <div className="text-center">Aucun chant trouvé</div>
          )}
        </div>
      </main>
    </div>
  );
}
