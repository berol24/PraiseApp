import { useEffect, useState } from "react";
import axios from "axios";
import AddChant from "./AddChant";
import { Link, useNavigate } from "react-router-dom";
import logo_PraiseApp from "./assets/logo_praiseApp.png";
import { handleDelete } from "./services/HandleDelete";
import { handleLogout } from "./services/HandleLogout";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });

export default function ShowChant() {
  const [user, setUser] = useState(null);
  const [chants, setChants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center">
              <img
                src={logo_PraiseApp}
                alt="logo_PraiseApp"
                className="h-16 w-16 mr-3 object-contain"
              />
              <h1 className="text-xl font-bold text-gray-700 sm:hidden">
                Liste des Chants
              </h1>
            </div>
          </div>

          <h1 className="hidden sm:block text-2xl md:text-3xl font-bold text-gray-700 text-center flex-1">
            Liste des Chants
          </h1>

          <div className="flex items-center justify-center border-2 border-gray-600 rounded-full w-12 h-12 sm:mx-6">
            <span className="text-lg font-bold text-gray-700">
              {" "}
              {user?.nom[0]}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition w-full sm:w-auto"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto p-6 sm:p-8 md:p-10 max-w-6xl">
        {/* Bouton Ajouter pour admin */}
        {user?.role === "admin" && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg transition w-full sm:w-auto"
            >
              + Ajouter un chant
            </button>
          </div>
        )}

        {/* Formulaire d'ajout si actif */}
        {showAddForm && (
          <AddChant
            onClose={() => setShowAddForm(false)}
            onAdded={fetchChants}
          />
        )}

        {/* Grille des chants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chants.map((c) => (
            <a href={`/showChants/${c._id}`} key={c._id} className="block">
              <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col justify-between cursor-pointer hover:shadow-xl transition">
                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  {c.titre}
                </h3>
                <p className="text-gray-500 italic mb-4">
                  Auteur : {c.auteur || "Inconnu"}
                </p>

                {user?.role === "admin" && (
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
                        handleDelete(c._id, navigate,fetchChants);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
