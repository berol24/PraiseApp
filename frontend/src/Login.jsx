import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: apiUrl
});

export default function Login({ onLogin, switchToRegister }) {
  const [form, setForm] = useState({ email: "", mot_de_passe: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
       localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur login");
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10 md:p-12">
    <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-6">Connexion</h2>
    {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none w-full"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none w-full"
        value={form.mot_de_passe}
        onChange={e => setForm({ ...form, mot_de_passe: e.target.value })}
        required
      />
      <button className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-3 rounded-lg w-full">
        Se connecter
      </button>
    </form>
    <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
      Pas de compte ?{" "}
      <button className="text-blue-500 font-semibold underline" onClick={switchToRegister}>
        S’inscrire
      </button>
    </p>
  </div>
</div>


  );
}
