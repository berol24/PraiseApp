import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Music2, Star, Share2, MessageCircle, Mail, Plus, Music, Search, Settings, Share, MessageSquare, Smartphone, Copy, Users, Hash, Menu, X, Loader2, AlertCircle } from "lucide-react";
import Button from "../components/common/Button";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import AddChant from "./AddChant";
import Modal from "../components/common/Modal";
import { toast } from "../services/toast";
import { formatError, isOnline } from "../utils/errorFormatter";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chants, setChants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChants, setFilteredChants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(() => parseInt(localStorage.getItem("fontSize") || "16"));
  const [feedbackForm, setFeedbackForm] = useState({ nom: "", message: "" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const retryCountRef = useRef(0);
  const maxRetries = 10; // Nombre maximum de tentatives
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    fetchChants();
    return () => {
      // Nettoyer le timeout si le composant est démonté
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const fetchChants = async (isRetry = false) => {
    try {
      setError("");
      if (!isRetry) {
        setLoading(true);
      }
      
      // Vérifier la connexion Internet avant de faire la requête
      if (!isOnline()) {
        setError("Vous êtes hors ligne. Veuillez vérifier votre connexion Internet.");
        setLoading(false);
        return;
      }
      
      const res = await api.get("/api/chants");
      setChants(res.data || []);
      setLoading(false);
      retryCountRef.current = 0; // Réinitialiser le compteur en cas de succès
    } catch (err) {
      console.error("Erreur lors du chargement des chants", err);
      
      // Formater le message d'erreur de manière conviviale
      const errorMessage = formatError(err);
      setError(errorMessage);
      
      // Retry automatique avec backoff exponentiel (seulement si en ligne)
      if (isOnline() && retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 30000); // Max 30 secondes
        
        retryTimeoutRef.current = setTimeout(() => {
          fetchChants(true);
        }, delay);
      } else {
        setLoading(false);
        if (!isOnline()) {
          retryCountRef.current = 0; // Réinitialiser si hors ligne
        }
      }
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = chants.filter(
      (chant) =>
        chant.titre?.toLowerCase().includes(term) ||
        chant.auteur?.toLowerCase().includes(term)
    );
    setFilteredChants(filtered);
  }, [searchTerm, chants]);

  const handleAddChant = () => {
    // Vérifier à la fois le contexte et le localStorage pour être sûr
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!user || !storedUser || !token) {
      navigate("/login");
      return;
    }
    setShowAddForm(true);
  };

  const shareUrl = "https://praiseapp.pages.dev/";
  const shareText = `Découvrez PraiseApp - Votre bibliothèque de chants de louange et d'adoration !

Fonctionnalités :
• Accédez à une vaste collection de chants
• Ajoutez vos chants préférés en favoris
• Partagez et ajoutez vos propres chants
• Recherchez facilement par titre ou auteur
• Application web progressive (PWA) - Installez-la sur votre téléphone !

Rejoignez notre communauté de louange et d'adoration !

Téléchargez maintenant : ${shareUrl}`;
  const shareMessage = shareText;

  const handleShareApp = () => {
    setShowShareModal(true);
  };

  const handleShareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, "_blank");
    setShowShareModal(false);
  };

  const handleShareToSMS = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(shareMessage)}`;
    window.location.href = smsUrl;
    setShowShareModal(false);
  };

  const handleShareToEmail = () => {
    const subject = encodeURIComponent("Découvrez PraiseApp");
    const body = encodeURIComponent(shareMessage);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
    setShowShareModal(false);
  };

  const handleShareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
    setShowShareModal(false);
  };

  const handleShareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
    setShowShareModal(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast("Lien copié dans le presse-papier !", "success");
      setShowShareModal(false);
    } catch (err) {
      toast("Erreur lors de la copie du lien", "error");
    }
  };

  const handleNativeShare = async () => {
    // Vérifier si l'API Web Share est disponible
    if (navigator.share) {
      try {
        // L'API Web Share ouvre le menu de partage natif du système
        // qui affiche TOUTES les applications installées capables de recevoir le partage
        await navigator.share({
          title: "PraiseApp",
          text: shareText,
          url: shareUrl,
        });
        // Le modal se ferme seulement si le partage réussit
        setShowShareModal(false);
        toast("Partage réussi !", "success");
      } catch (err) {
        // Si l'utilisateur annule, on ne fait rien (c'est normal)
        if (err.name === "AbortError") {
          // L'utilisateur a annulé le partage - pas d'erreur à afficher
          return;
        }
        // Pour les autres erreurs, on affiche un message
        console.error("Erreur lors du partage:", err);
        toast("Erreur lors du partage. Veuillez réessayer.", "error");
      }
    } else {
      // Fallback si l'API n'est pas disponible
      toast("Le partage natif n'est pas disponible sur cet appareil", "info");
    }
  };

  const handleFontSizeChange = (size) => {
    localStorage.setItem("fontSize", size.toString());
    setCurrentFontSize(size);
    toast(`Taille de police définie à ${size}px pour l'affichage des chants`, "success");
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/feedback", feedbackForm);
      toast("Merci pour votre avis !", "success");
      setShowFeedbackModal(false);
      setFeedbackForm({ nom: "", message: "" });
    } catch (err) {
      toast("Erreur lors de l'envoi de l'avis", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Dégradé de fond animé - Couleurs du logo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-100"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,64,175,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_50%)]"></div>
      
      {/* Header avec boutons */}
      <header className="relative z-20 bg-white/90 backdrop-blur-xl shadow-lg sticky top-0 border-b border-gray-200/50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent">
                🎵 PraiseApp
              </h1>
            </Link>

            {/* Boutons desktop - cachés sur mobile */}
            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              <button
                onClick={handleShareApp}
                className="p-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                title="Partager l'application"
              >
                <Share className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                title="Paramètres"
              >
                <Settings className="w-5 h-5" />
              </button>
              {user ? (
                <Link
                  to="/showChants"
                  className="px-4 py-2 text-base bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Mon espace
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-base bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-base bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>

            {/* Bouton menu burger - visible uniquement sur mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Menu burger mobile - slide down */}
          <div
            className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "max-h-[400px] opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm rounded-b-xl">
              <div className="flex flex-col gap-2 p-4">
                <button
                  onClick={() => {
                    handleShareApp();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all text-left"
                >
                  <Share className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">Partager l'application</span>
                </button>
                <button
                  onClick={() => {
                    setShowSettingsModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all text-left"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-800">Paramètres</span>
                </button>
                {user ? (
                  <Link
                    to="/showChants"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all"
                  >
                    <span className="font-semibold text-gray-800">Mon espace</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold transition-all"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-semibold transition-all"
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 relative z-10 container mx-auto px-4 py-8">
        {/* Titre et recherche */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
            Découvrez nos chants
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un chant..."
                className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 pl-12 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm shadow-md"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
            <button
              onClick={handleAddChant}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-700/40 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un chant
            </button>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && !loading && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-700 text-sm text-center animate-fadeIn">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium">{error}</span>
            </div>
            {retryCountRef.current > 0 && retryCountRef.current < maxRetries && (
              <p className="mt-2 text-xs text-red-600">
                Nouvelle tentative dans quelques instants... ({retryCountRef.current}/{maxRetries})
              </p>
            )}
          </div>
        )}

        {/* Grille des chants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                <p className="text-xl font-semibold text-gray-700 mb-2">Chargement des chants...</p>
                <p className="text-gray-500">Veuillez patienter</p>
              </div>
            </div>
          ) : filteredChants.length > 0 ? (
            filteredChants.map((c) => (
              <Link to={`/showChants/${c._id}`} key={c._id} className="block group">
                <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-all duration-300 border border-white/20 hover:-translate-y-2 h-full">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {c.titre}
                    </h3>
                    <p className="text-gray-600 italic text-sm mb-2">
                      <span className="font-semibold">Auteur:</span> {c.auteur || "Inconnu"}
                    </p>
                    {c.langue && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium">
                        {c.langue}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                <Music className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <p className="text-xl font-semibold text-gray-700 mb-2">Aucun chant trouvé</p>
                <p className="text-gray-500">
                  {searchTerm ? "Essayez de modifier votre recherche" : "Aucun chant disponible pour le moment"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bouton pour donner un avis */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <MessageCircle className="w-5 h-5" />
            Donner un avis
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-lg mt-auto">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            {/* Titre du footer */}
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent mb-2">
                Contactez-nous
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Une question ? Une suggestion ? N'hésitez pas à nous contacter !
              </p>
            </div>

            {/* Informations de contact */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full max-w-2xl">
              {/* WhatsApp */}
              <a
                href="https://wa.me/237687962949"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
              >
                <div className="bg-white/20 rounded-full p-2.5 group-hover:bg-white/30 transition-colors">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-medium opacity-90">WhatsApp</p>
                  <p className="text-sm sm:text-base font-semibold">+237 6 87 96 29 49</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:berolbertindjomo@gmail.com"
                className="group flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-xl shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-700/40 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
              >
                <div className="bg-white/20 rounded-full p-2.5 group-hover:bg-white/30 transition-colors">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-medium opacity-90">Email</p>
                  <p className="text-sm sm:text-base font-semibold truncate max-w-[200px] sm:max-w-none">
                    berolbertindjomo@gmail.com
                  </p>
                </div>
              </a>
            </div>

            {/* Copyright */}
            <div className="pt-4 border-t border-gray-200/50 w-full text-center">
              <p className="text-xs sm:text-sm text-gray-500">
                © {new Date().getFullYear()} PraiseApp. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal pour ajouter un chant */}
      {showAddForm && (
        <AddChant
          onClose={() => setShowAddForm(false)}
          onAdded={fetchChants}
        />
      )}

      {/* Modal pour donner un avis */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="Donner un avis"
      >
        <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={feedbackForm.nom}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, nom: e.target.value })}
              required
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={feedbackForm.message}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
              required
              rows="5"
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              placeholder="Votre avis..."
            />
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Envoyer
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowFeedbackModal(false)}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal pour le partage */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Partager l'application"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center mb-4">
            Choisissez une méthode pour partager PraiseApp avec vos proches
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* WhatsApp */}
            <button
              onClick={handleShareToWhatsApp}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-xl border border-emerald-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <div className="p-3 bg-emerald-500 rounded-full">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">WhatsApp</span>
            </button>

            {/* SMS */}
            <button
              onClick={handleShareToSMS}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border border-blue-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <div className="p-3 bg-blue-500 rounded-full">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">SMS</span>
            </button>

            {/* Email */}
            <button
              onClick={handleShareToEmail}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl border border-gray-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <div className="p-3 bg-gray-600 rounded-full">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Email</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleShareToFacebook}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-xl border border-blue-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <div className="p-3 bg-blue-600 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Facebook</span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={handleShareToTwitter}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-sky-50 to-cyan-100 hover:from-sky-100 hover:to-cyan-200 rounded-xl border border-sky-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <div className="p-3 bg-sky-500 rounded-full">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Twitter/X</span>
            </button>

            {/* Copier le lien */}
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl border border-purple-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <div className="p-3 bg-purple-500 rounded-full">
                <Copy className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Copier</span>
            </button>
          </div>

          {/* Partage natif si disponible */}
          {navigator.share ? (
            <>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-3">
                  💡 Utilisez le partage natif pour voir toutes les applications installées sur votre téléphone
                </p>
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Partager via toutes les applications</span>
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                ℹ️ Le partage natif n'est pas disponible sur cet appareil/navigateur. Utilisez les options ci-dessus.
              </p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowShareModal(false)}
              className="w-full"
            >
              Fermer
        </Button>
      </div>
        </div>
      </Modal>

      {/* Modal pour les paramètres */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Paramètres d'affichage"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taille de la police pour l'affichage des chants
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Cette taille s'appliquera uniquement lors de la lecture des paroles des chants.
            </p>
            <div className="flex gap-2 flex-wrap">
              {[12, 14, 16, 18, 20, 24].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleFontSizeChange(size)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    currentFontSize === size
                      ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowSettingsModal(false)}
              className="w-full"
            >
              Fermer
            </Button>
      </div>
        </div>
      </Modal>
    </div>
  );
}
