
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      
      {/* Logo ou titre */}
      <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-800 mb-6 text-center drop-shadow-lg">
        🎵 Chantons Ensemble
      </h1>

      {/* Sous-titre */}
      <p className="text-lg sm:text-xl text-blue-700 mb-10 text-center max-w-xl">
        Découvrez, ajoutez et partagez vos chants préférés facilement.
      </p>

      {/* Boutons de navigation */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1"
        >
          Connexion
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1"
        >
          Inscription
        </button>
      </div>

      {/* Image ou illustration (optionnelle) */}
      <div className="mt-12">
        <img
          src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=800&q=80"
          alt="Chants"
          className="rounded-3xl shadow-2xl w-full max-w-lg"
        />
      </div>
    </div>
  );
}
