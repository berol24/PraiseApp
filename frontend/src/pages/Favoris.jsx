// src/pages/Favoris.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

export default function Favoris() {
  const [user, setUser] = useState(null);
  const [favoris, setFavoris] = useState([]);
  const navigate = useNavigate();
console.log("mes fav",favoris.length);

  // ✅ Récupération de l'utilisateur
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/login");
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // ✅ Récupération des favoris depuis le backend
  const fetchFavoris = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get("/api/chants/favoris");
      console.log("favoris backend:", res.data);
      setFavoris(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des favoris", err);
    }
  }, [user]);

  useEffect(() => {
    fetchFavoris();
  }, [fetchFavoris]);

  // Ajouter ou retirer un favori
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
      <Header user={user} number_chants={favoris.length} navigate={navigate} titre="MES FAVORIS" />
      
      <main className="container mx-auto p-6 sm:p-8 md:p-10 max-w-6xl">
        {favoris.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoris.map((c, index) => (
              <Link to={`/showChants/${c._id}`} key={c._id || index} className="block group">
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
                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-lg font-medium">
                          {c.langue}
                        </span>
                      )}
                    </div>

                    {user && (
                      <button
                        onClick={(e) => handleFavori(c._id, e)}
                        className="text-3xl transition-all transform hover:scale-110 text-amber-500 hover:text-amber-600"
                        title="Retirer des favoris"
                      >
                        ★
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
