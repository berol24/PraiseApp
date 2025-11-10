// src/pages/Favoris.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });

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
  }, []);

  // ✅ Récupération des favoris depuis le backend
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
      console.log("favoris backend:", res.data);

      // res.data doit être un tableau d’objets chants
      setFavoris(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des favoris", err);
    }
  };

  // Ajouter ou retirer un favori
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
    <>
      <Header user={user} number_chants={favoris.length} navigate={navigate} titre="MES FAVORIS" />
      {/* <h1 className="text-3xl font-extrabold text-center text-black-700 my-8">MES FAVORIS </h1> */}
      {favoris.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {favoris.map((c, index) => (
            <a
              href={`/showChants/${c._id}`}
              key={c._id || index}
              className="block"
            >
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
              </div>
            </a>
          ))}
        </div>
      ) : (
        // ✅ Texte centré horizontalement et verticalement si aucun favori
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600 text-lg font-medium">
            Aucun chant trouvé en favoris
          </p>
        </div>
      )}
    </>
  );
}
