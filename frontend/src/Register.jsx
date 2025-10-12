

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import icon_loading from "./assets/icon_loading.png";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "", mot_de_passe: "" });
  const [error, setError] = useState("");
  const[loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur lors de l’inscription");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Créer un compte
        </h2>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.mot_de_passe}
            onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
            required
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
         <button className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-4 rounded  cursor-pointer hover:bg-green-600 transition">
            S’inscrire { loading && <img className="w-5 h-5 animate-spin" src={icon_loading} alt="Chargement..." />}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-green-500 underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
