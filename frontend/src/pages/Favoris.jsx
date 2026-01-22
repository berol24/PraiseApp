import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, XCircle, Music } from "lucide-react";
import Header from "../components/Header";
import api from "../services/api";

export default function Favoris() {
  const [user, setUser] = useState(null);
  const [favoris, setFavoris] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChants, setFilteredChants] = useState([]);
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
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/login");
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const fetchFilters = useCallback(async () => {
    try {
      const res = await api.get("/api/chants/filters");
      setAvailableFilters(res.data || { categories: [], langues: [], rythmes: [] });
    } catch (err) {
      console.error("Erreur lors du chargement des filtres", err);
    }
  }, []);

  const fetchFavoris = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get("/api/chants/favoris");
      setFavoris(res.data || []);
      fetchFilters();
    } catch (err) {
      console.error("Erreur lors du chargement des favoris", err);
    }
  }, [user, fetchFilters]);

  useEffect(() => {
    fetchFavoris();
  }, [fetchFavoris]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = favoris.filter((chant) => {
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
        if (chant.langue?.toLowerCase() !== selectedFilters.langue.toLowerCase()) return false;
      }
      if (selectedFilters.rythme) {
        if (chant.rythme?.toLowerCase() !== selectedFilters.rythme.toLowerCase()) return false;
      }
      return true;
    });
    setFilteredChants(filtered);
  }, [searchTerm, favoris, selectedFilters]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-yellow-50">
      <Header user={user} number_chants={filteredChants.length} navigate={navigate} titre="MES FAVORIS" />

      <main className="container mx-auto p-6 sm:p-8 md:p-10 max-w-6xl">
        {favoris.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="relative w-full sm:w-80">
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full sm:w-auto font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  hasActiveFilters
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 text-white"
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
            </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {availableFilters.categories.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                      <div className="flex flex-wrap gap-2">
                        {availableFilters.categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => handleFilterChange("category", cat)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                              selectedFilters.category === cat
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {availableFilters.langues.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Langue</label>
                      <div className="flex flex-wrap gap-2">
                        {availableFilters.langues.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => handleFilterChange("langue", lang)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                              selectedFilters.langue === lang
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {availableFilters.rythmes.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Rythme</label>
                      <div className="flex flex-wrap gap-2">
                        {availableFilters.rythmes.map((r) => (
                          <button
                            key={r}
                            onClick={() => handleFilterChange("rythme", r)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                              selectedFilters.rythme === r
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {favoris.length > 0 ? (
          filteredChants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChants.map((c, index) => (
                <Link to={`/showChants/${c._id}`} key={c._id || index} className="block group">
                  <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-all duration-300 border border-white/20 hover:-translate-y-2 h-full">
                    <div className="relative mb-4">
                      {user && (
                        <button
                          onClick={(e) => handleFavori(c._id, e)}
                          className="absolute top-0 right-0 text-3xl transition-all transform hover:scale-110 text-amber-500 hover:text-amber-600"
                          title="Retirer des favoris"
                        >
                          ★
                        </button>
                      )}
                      <div className={`text-center flex flex-col items-center ${user ? "pr-10" : ""}`}>
                        <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 w-full">
                          {c.titre}
                        </h3>
                        <p className="text-gray-600 italic text-sm mb-2">
                          <span className="font-semibold">Auteur:</span> {c.auteur || "Inconnu"}
                        </p>
                        {c.langue && (
                          <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-lg font-medium">
                            {c.langue}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <Music className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <p className="text-xl font-semibold text-gray-700 mb-2">Aucun chant trouvé</p>
              <p className="text-gray-500 mb-4">Essayez de modifier votre recherche ou vos filtres</p>
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md">
              <div className="text-6xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun favori</h2>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore ajouté de chants à vos favoris
              </p>
              <Link
                to="/showChants"
                className="inline-block bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Découvrir les chants
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
