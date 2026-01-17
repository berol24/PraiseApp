
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Dégradé de fond - Couleurs du logo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-100"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(30,64,175,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(234,179,8,0.08),transparent_50%)]"></div>
      
      <div className="relative z-10 w-full max-w-md animate-slideUp">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-700 via-blue-800 to-orange-500 rounded-2xl shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent mb-2">
              Connexion
            </h2>
            <p className="text-gray-600 text-sm">Bienvenue sur PraiseApp</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center animate-fadeIn">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-blue-700" />
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all pl-10"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 text-blue-700" />
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.mot_de_passe}
                  onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all pl-10"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1"
              >
                Mot de passe oublié?
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white font-semibold py-3 px-4 rounded-xl cursor-pointer hover:from-blue-800 hover:to-blue-900 transition-all shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-700/40 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>
          
          <p className="mt-6 text-center text-gray-600 text-sm">
            Pas de compte ?{" "}
            <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors flex items-center justify-center gap-1">
              S'inscrire
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
