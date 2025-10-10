import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: apiUrl
});

export default function Register({ onRegister, switchToLogin }) {
  const [form, setForm] = useState({ nom: "", email: "", mot_de_passe: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/register", form);
      // Auto-login après inscription
      const loginRes = await api.post("/login", { email: form.email, mot_de_passe: form.mot_de_passe });
      localStorage.setItem("token", loginRes.data.token);
      onRegister(loginRes.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur inconnue");
    }
  };

  return (
 <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10 md:p-12">
    <h2 className="text-3xl sm:text-4xl font-bold text-center text-green-600 mb-6">Créer un compte</h2>
    {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Nom"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none w-full"
        value={form.nom}
        onChange={e => setForm({ ...form, nom: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none w-full"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none w-full"
        value={form.mot_de_passe}
        onChange={e => setForm({ ...form, mot_de_passe: e.target.value })}
        required
      />
      <button className="bg-green-500 hover:bg-green-600 transition text-white font-semibold py-3 rounded-lg w-full">
        S’inscrire
      </button>
    </form>
    <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
      Déjà un compte ?{" "}
      <button className="text-green-500 font-semibold underline" onClick={switchToLogin}>
        Se connecter
      </button>
    </p>
  </div>
</div>


  );
}
