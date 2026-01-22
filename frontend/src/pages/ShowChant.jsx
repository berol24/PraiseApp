import { useEffect, useState, useCallback } from "react";
import { Search, Edit, Trash2, Plus, Music, Filter, XCircle } from "lucide-react";
import api from "../services/api";
import AddChant from "./AddChant";
import { Link, useNavigate } from "react-router-dom";
import { handleDelete } from "../services/HandleDelete";
import Header from "../components/Header";
import ConfirmModal from "../components/common/ConfirmModal";
// api instance imported

export default function ShowChant() {
  const [user, setUser] = useState(null);
  const [chants, setChants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChants, setFilteredChants] = useState([]);
  const [favoris, setFavoris] = useState([]); // liste locale des favoris
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, chantId: null });
  // États pour les filtres
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    langues: [],
    rythmes: []
  });
  const [selectedFilters, setSelectedFilters] = useState({
    category: null,
    langue: null,
    rythme: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState(() => localStorage.getItem("sortOrderShowChant") || "titre-asc");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/login");
    setUser(JSON.parse(storedUser));
    fetchChants();
    fetchFilters();
  }, [navigate]);

  const fetchFilters = async () => {
    try {
      const res = await api.get("/api/chants/filters");
      setAvailableFilters(res.data || { categories: [], langues: [], rythmes: [] });
    } catch (err) {
      console.error("Erreur lors du chargement des filtres", err);
    }
  };

  const fetchChants = async () => {
    try {
      const res = await api.get("/api/chants");
      setChants(res.data);
      fetchFilters();
    } catch (err) {
      console.error("Erreur lors du chargement des chants", err);
    }
  };

  // Filtrage par recherche et par filtres (catégorie, langue, rythme)
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = chants.filter((chant) => {
      const matchesSearch =
        chant.titre?.toLowerCase().includes(term) ||
        chant.auteur?.toLowerCase().includes(term);
      if (!matchesSearch) return false;

      if (selectedFilters.category) {
        const hasCategory = chant.categories?.some(
          (cat) => cat?.toLowerCase() === selectedFilters.category.toLowerCase()
        );
        if (!hasCategory) return false;
      }
      if (selectedFilters.langue) {
        if (chant.langue?.toLowerCase() !== selectedFilters.langue.toLowerCase()) {
          return false;
        }
      }
      if (selectedFilters.rythme) {
        if (chant.rythme?.toLowerCase() !== selectedFilters.rythme.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
    const cmp = (a, b) => {
      switch (sortOrder) {
        case "titre-asc": return (a.titre || "").localeCompare(b.titre || "");
        case "titre-desc": return (b.titre || "").localeCompare(a.titre || "");
        case "date-desc": return new Date(b.date_creation || 0) - new Date(a.date_creation || 0);
        case "date-asc": return new Date(a.date_creation || 0) - new Date(b.date_creation || 0);
        case "auteur-asc": return (a.auteur || "").localeCompare(b.auteur || "");
        default: return 0;
      }
    };
    filtered.sort(cmp);
    setFilteredChants(filtered);
  }, [searchTerm, chants, selectedFilters, sortOrder]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({ category: null, langue: null, rythme: null });
  };

  const hasActiveFilters = Object.values(selectedFilters).some((f) => f !== null);

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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
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

            <div className="flex gap-2 w-full sm:w-auto">
              {/* Bouton Filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full sm:w-auto font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                  hasActiveFilters
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
                }`}
              >
                <Filter className="w-5 h-5" />
                Filtres
                {hasActiveFilters && (
                  <span className="bg-white/30 text-xs px-2 py-0.5 rounded-full">
                    {Object.values(selectedFilters).filter((f) => f !== null).length}
                  </span>
                )}
              </button>
              {/* Bouton Ajouter */}
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-700/40 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter un chant
              </button>
            </div>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  Filtres
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableFilters.categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleFilterChange("category", category)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            selectedFilters.category === category
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {availableFilters.langues.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Langue
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.langues.map((langue) => (
                        <button
                          key={langue}
                          onClick={() => handleFilterChange("langue", langue)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            selectedFilters.langue === langue
                              ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {langue}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {availableFilters.rythmes.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rythme
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.rythmes.map((rythme) => (
                        <button
                          key={rythme}
                          onClick={() => handleFilterChange("rythme", rythme)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            selectedFilters.rythme === rythme
                              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {rythme}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Filtres actifs :</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFilters.category && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                        Catégorie: {selectedFilters.category}
                        <button
                          onClick={() => handleFilterChange("category", selectedFilters.category)}
                          className="hover:text-blue-900"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedFilters.langue && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">
                        Langue: {selectedFilters.langue}
                        <button
                          onClick={() => handleFilterChange("langue", selectedFilters.langue)}
                          className="hover:text-green-900"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedFilters.rythme && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm">
                        Rythme: {selectedFilters.rythme}
                        <button
                          onClick={() => handleFilterChange("rythme", selectedFilters.rythme)}
                          className="hover:text-purple-900"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <label className="text-sm font-medium text-gray-700">Trier par :</label>
          <select
            value={sortOrder}
            onChange={(e) => {
              const v = e.target.value;
              setSortOrder(v);
              localStorage.setItem("sortOrderShowChant", v);
            }}
            className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-700 bg-white"
          >
            <option value="titre-asc">Titre A-Z</option>
            <option value="titre-desc">Titre Z-A</option>
            <option value="date-desc">Plus récents</option>
            <option value="date-asc">Plus anciens</option>
            <option value="auteur-asc">Auteur A-Z</option>
          </select>
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
            filteredChants.map((c) => {
              const isNew = c.date_creation && (Date.now() - new Date(c.date_creation).getTime()) < 7 * 24 * 60 * 60 * 1000;
              return (
              <Link to={`/showChants/${c._id}`} key={c._id} className="block group">
                <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-all duration-300 border border-white/20 hover:-translate-y-2 h-full relative">
                  {isNew && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">Nouveau</span>
                  )}
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
                        setDeleteModal({ isOpen: true, chantId: c._id });
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </Link>
              );
            })
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

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, chantId: null })}
        onConfirm={() => {
          if (deleteModal.chantId) {
            handleDelete(deleteModal.chantId, navigate, fetchChants);
          }
        }}
        title="Supprimer le chant"
        message="Voulez-vous vraiment supprimer ce chant ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
