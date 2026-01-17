import { useEffect, useState, useCallback } from "react";
import { Search, Edit, Trash2, Plus, Music } from "lucide-react";
import api from "../services/api";
import AddChant from "./AddChant";
import { Link, useNavigate } from "react-router-dom";
import { handleDelete } from "../services/HandleDelete";
import Header from "../components/Header";
// api instance imported

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
  }, [navigate]);

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

  const fetchFavoris = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get("/api/chants/favoris");
      setFavoris(res.data);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
        return;
      }
      console.error("Erreur lors du chargement des favoris", err);
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchFavoris();
  }, [fetchFavoris]);

  //  Ajouter ou retirer un favori
  const handleFavori = async (chantId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await api.post(`/api/chants/favoris/${chantId}`);
      fetchFavoris();
    } catch (err) {
      console.error("Erreur favoris :", err);
    }
  };

  // Vérifier si un chant est en favoris
  const isFavori = (chantId) => favoris.some((f) => f._id === chantId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-yellow-50">
      <Header
        navigate={navigate}
        user={user}
        number_chants={filteredChants.length}
        titre="Liste des Chants"
      />
      {/* Contenu principal */}
      <main className="container mx-auto p-6 sm:p-8 md:p-10 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          {/* Champ de recherche */}
          <div className="relative w-full sm:w-80 flex-1 sm:flex-initial">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un chant..."
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 pl-12 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm shadow-md"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
          </div>
          
          {/* Bouton Ajouter */}
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-700/40 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter un chant
          </button>
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
              <Link to={`/showChants/${c._id}`} key={c._id} className="block group">
                <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-all duration-300 border border-white/20 hover:-translate-y-2 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {c.titre}
                      </h3>
                      <p className="text-gray-600 italic text-sm mb-2">
                        <span className="font-semibold">Auteur:</span> {c.auteur || "Inconnu"}
                      </p>
                      {c.langue && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium">
                          {c.langue}
                        </span>
                      )}
                    </div>

                    {/* ⭐ Bouton Favori */}
                    {user && (
                      <button
                        onClick={(e) => handleFavori(c._id, e)}
                        className={`text-3xl transition-all transform hover:scale-110 ${
                          isFavori(c._id)
                            ? "text-amber-500 hover:text-amber-600"
                            : "text-gray-300 hover:text-amber-400"
                        }`}
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

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <Link
                      to={`/editChant/${c._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-center text-sm flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Éditer
                    </Link>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(c._id, navigate, fetchChants);
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                <Music className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <p className="text-xl font-semibold text-gray-700 mb-2">Aucun chant trouvé</p>
                <p className="text-gray-500">Essayez de modifier votre recherche</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
