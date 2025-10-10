import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";
import AddChant from "./AddChant";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });

export default function App() {
  const [user, setUser] = useState(null);
  const [chants, setChants] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchChants = async () => {
    const res = await api.get("/api/chants");
    setChants(res.data);
  };

  useEffect(() => { fetchChants(); }, []);

  if (!user) {
    return showRegister ? (
      <Register onRegister={setUser} switchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={setUser} switchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
 <div className="p-6 sm:p-8 md:p-10 max-w-6xl mx-auto">
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-700 mb-8">🎵 Liste des Chants</h1>

  {user && (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
      <p className="text-gray-600 text-sm sm:text-base">Connecté en tant que <b>{user.nom}</b> ({user.role})</p>
      <button
        onClick={() => { localStorage.clear(); setUser(null); }}
        className="bg-red-500 hover:bg-red-600 transition text-white font-semibold py-2 px-4 rounded-lg"
      >
        Déconnexion
      </button>
    </div>
  )}
  {user?.role === "admin" && (
  <div className="flex justify-end mb-6">
    <button
      onClick={() => setShowAddForm(true)}
      className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-2 px-4 rounded-lg"
    >
      + Ajouter un chant
    </button>
  </div>
)}
{showAddForm && (
  <AddChant
    onClose={() => setShowAddForm(false)}
    onAdded={fetchChants}
  />
)}


  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {chants.map(c => (
      <div key={c._id} className="bg-white shadow-lg rounded-2xl p-5 flex flex-col justify-between">
        <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-2">{c.titre}</h3>
        <p className="text-sm sm:text-base text-gray-500 italic mb-3">Auteur : {c.auteur || "Inconnu"}</p>
        {c.fichiers?.video_youtube && (
          <a
            href={c.fichiers.video_youtube}
            className="text-blue-500 underline hover:text-blue-600 transition text-sm sm:text-base"
            target="_blank"
          >
            ▶️ Voir sur YouTube
          </a>
        )}
      </div>
    ))}
  </div>
</div>


  );
}
