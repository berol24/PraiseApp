import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await api.post(`/api/forgot-password`, { email, password, confirmPassword });
    const data = res.data;
    const timer =  setTimeout(() => {
      setMessage('');
      navigate('/login');
    }, 2000);
    setMessage(data.type === "success" ? data.message + " \n redirection vers la page de connexion ..." : data.message);
    setType(data.type);
    {data.type !== "success" && clearTimeout(timer)}
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
                <KeyRound className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent mb-2">
              Modifier votre mot de passe
            </h2>
            <p className="text-gray-600 text-sm">Entrez votre email et votre nouveau mot de passe</p>
          </div>
          
          {message && (
            <div className={`mb-4 p-3 rounded-xl text-sm text-center animate-fadeIn ${
              type === 'danger' || type === 'error' 
                ? 'bg-red-50 border border-red-200 text-red-800' 
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}>
              {message}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 text-blue-700" />
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 text-blue-700" />
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all pl-10"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-700/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <KeyRound className="w-5 h-5" />
              Mettre à jour
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
