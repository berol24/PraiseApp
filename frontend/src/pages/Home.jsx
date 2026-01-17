import Button from "../components/common/Button";
import { Music2, Star, Share2 } from "lucide-react";

export default function Home() {
  const cards = [
    {
      icon: Music2,
      title: "Découvrir",
      desc: "Explorez une vaste collection de chants",
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Star,
      title: "Favoris",
      desc: "Sauvegardez vos chants préférés",
      bg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: Share2,
      title: "Partager",
      desc: "Partagez avec votre communauté",
      bg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Dégradé de fond animé - Couleurs du logo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-100 animate-pulse opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,64,175,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_50%)]"></div>
      
      <div className="relative z-10 w-full max-w-4xl text-center animate-fadeIn">
        {/* Logo ou titre */}
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
            🎵 PraiseApp
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Chantons Ensemble
          </h2>
        </div>

        {/* Sous-titre */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-12 text-center max-w-2xl mx-auto leading-relaxed">
          Découvrez, ajoutez et partagez vos chants préférés facilement.
          <span className="block mt-2 text-base sm:text-lg text-gray-600">
            Une communauté de louange et d'adoration
          </span>
        </p>

        {/* Boutons de navigation */}
        <div className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-4 mb-16">
          <Button to="/login" variant="primary" className="flex-1">
            Connexion
          </Button>
          <Button to="/register" variant="secondary" className="flex-1">
            Inscription
          </Button>
        </div>

        {/* Cards d'illustration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {cards.map(({ icon: Icon, title, desc, bg, iconColor }) => (
            <div
              key={title}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-4 ${bg} ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
