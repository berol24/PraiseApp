

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import icon_loading from "../assets/icon_loading.png";
import { useAuth } from "../hooks/useAuth";
import { setToken as saveToken } from "../services/authService";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", mot_de_passe: "" });
  const [error, setError] = useState("");
  const[loading, setLoading] = useState(false);
  

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!navigator.onLine) throw new Error("Vous êtes hors ligne — vérifiez votre connexion");
      const res = await api.post(`/api/login`, form);
      const data = res.data;
      // save token + user in context
      saveToken(data.token);
      login(data.token, data.user);
      navigate("/showChants");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur de connexion");
      saveToken(null);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Connexion
        </h2>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.mot_de_passe}
            onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
            required
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
            <div className="mt-3 flex justify-end">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-blue-600 hover:text-bleu-800 hover:underline underline-offset-8"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>
              </div>
          {/* <button className="flex bg-blue-500 text-white font-semibold py-3 rounded hover:bg-blue-600 transition"> */}
            <button className="flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-3 px-4 rounded cursor-pointer hover:bg-blue-600 transition">
            Se connecter{ loading && <img className="w-5 h-5 animate-spin" src={icon_loading} alt="Chargement..." />}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm">
          Pas de compte ?{" "}
          <Link to="/register" className="text-blue-500 underline">
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
