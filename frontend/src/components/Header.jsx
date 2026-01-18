import { useState } from "react";
import logo_PraiseApp from "../assets/logo_praiseApp.png";
import { Link, useNavigate } from "react-router-dom";
import { Star, Settings, LogOut, Menu, X, Share, MessageSquare, Smartphone, Mail, Users, Hash, Copy, Share2 } from "lucide-react";
import Button from "./common/Button";
import Modal from "./common/Modal";
import { useAuth } from "../hooks/useAuth";
import { toast } from "../services/toast";

function Header({ user, number_chants, titre }) {
  const nav = useNavigate();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(() => parseInt(localStorage.getItem("fontSize") || "16"));
  console.log("number_chants dans header", number_chants);

  const handleLogout = () => {
    logout(false); // Ne pas rediriger automatiquement, on le fait manuellement
    setIsMenuOpen(false);
    nav("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Fonctions de partage
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

  const handleShareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, "_blank");
    setShowShareModal(false);
    closeMenu();
  };

  const handleShareToSMS = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(shareMessage)}`;
    window.location.href = smsUrl;
    setShowShareModal(false);
    closeMenu();
  };

  const handleShareToEmail = () => {
    const subject = encodeURIComponent("Découvrez PraiseApp");
    const body = encodeURIComponent(shareMessage);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
    setShowShareModal(false);
    closeMenu();
  };

  const handleShareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
    setShowShareModal(false);
    closeMenu();
  };

  const handleShareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
    setShowShareModal(false);
    closeMenu();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast("Lien copié dans le presse-papiers !", "success");
      setShowShareModal(false);
      closeMenu();
    } catch (err) {
      toast("Erreur lors de la copie du lien", "error");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "PraiseApp",
          text: shareText,
          url: shareUrl,
        });
        setShowShareModal(false);
        closeMenu();
      } catch (err) {
        if (err.name !== "AbortError") {
          toast("Erreur lors du partage", "error");
        }
      }
    }
  };

  const handleFontSizeChange = (size) => {
    localStorage.setItem("fontSize", size.toString());
    setCurrentFontSize(size);
    toast(`Taille de police définie à ${size}px pour l'affichage des chants`, "success");
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto flex items-center justify-between p-4 gap-4">
        {/* Logo et titre */}
        <div className="flex items-center gap-3 flex-1">
          <Link to={user ? "/showChants" : "/"} className="hover:opacity-80 transition-opacity" onClick={closeMenu}>
            {logo_PraiseApp ? (
              <img
                src={logo_PraiseApp}
                alt="logo_PraiseApp"
                className="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-xl shadow-md"
              />
            ) : (
              <div className="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-orange-500 rounded-xl font-bold text-white text-xl shadow-lg">
                P
              </div>
            )}
          </Link>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent flex-1">
            {titre} {number_chants !== undefined && number_chants !== null ? `(${number_chants})` : ""}
          </h1>
        </div>

        {/* Boutons desktop - cachés sur mobile */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3">
          {/* Boutons Partager et Paramètres - toujours visibles */}
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
            title="Partager l'application"
          >
            <Share className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
            title="Paramètres"
          >
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          {user && (
            <>
              <Button to={"/favoris"} variant="success" className="text-sm md:text-base flex items-center gap-1">
                <Star className="w-4 h-4" />
                Favoris
              </Button>
              {user?.role === "admin" && (
                <Button to={"/admin"} variant="secondary" className="text-sm md:text-base flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  Admin
                </Button>
              )}
              <Link
                to="/profile"
                className="flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-orange-500 rounded-full w-10 h-10 md:w-12 md:h-12 shadow-md border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                title="Voir mon profil"
              >
                <span className="text-base md:text-lg font-bold text-white leading-none select-none">{user?.nom[0]?.toUpperCase() || "?"}</span>
              </Link>
              <Button variant="danger" onClick={handleLogout} className="text-sm md:text-base flex items-center gap-1">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </>
          )}
        </div>

        {/* Bouton menu burger - visible uniquement sur mobile */}
        <button
          onClick={toggleMenu}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Menu burger mobile - slide down */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col gap-2 p-4">
            {/* Boutons Partager et Paramètres - toujours visibles */}
            <button
              onClick={() => {
                setShowShareModal(true);
                closeMenu();
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all text-left"
            >
              <Share className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-800">Partager l'application</span>
            </button>
            <button
              onClick={() => {
                setShowSettingsModal(true);
                closeMenu();
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all text-left"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Paramètres</span>
            </button>
            
            {user && (
              <>
                <Link
                  to="/favoris"
                  onClick={closeMenu}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all"
                >
                  <Star className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-800">Favoris</span>
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all"
                  >
                    <Settings className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">Admin</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all"
                >
                  <div className="flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-orange-500 rounded-full w-10 h-10 shadow-md">
                    <span className="text-base font-bold text-white leading-none">{user?.nom[0]?.toUpperCase() || "?"}</span>
                  </div>
                  <span className="font-semibold text-gray-800">Mon Profil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all text-left"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-800">Déconnexion</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal pour le partage */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Partager l'application"
        size="md"
      >
        <div className="space-y-4 sm:space-y-6 pb-2">
          <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 px-2">
            Choisissez une méthode pour partager PraiseApp avec vos proches
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* WhatsApp */}
            <button
              onClick={handleShareToWhatsApp}
              className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-xl border border-emerald-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-h-[100px] sm:min-h-[120px]"
            >
              <div className="p-2.5 sm:p-3 bg-emerald-500 rounded-full">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center">WhatsApp</span>
            </button>

            {/* SMS */}
            <button
              onClick={handleShareToSMS}
              className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border border-blue-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-h-[100px] sm:min-h-[120px]"
            >
              <div className="p-2.5 sm:p-3 bg-blue-500 rounded-full">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center">SMS</span>
            </button>

            {/* Email */}
            <button
              onClick={handleShareToEmail}
              className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl border border-gray-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-h-[100px] sm:min-h-[120px]"
            >
              <div className="p-2.5 sm:p-3 bg-gray-600 rounded-full">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center">Email</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleShareToFacebook}
              className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-xl border border-blue-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-h-[100px] sm:min-h-[120px]"
            >
              <div className="p-2.5 sm:p-3 bg-blue-600 rounded-full">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center">Facebook</span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={handleShareToTwitter}
              className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-sky-50 to-cyan-100 hover:from-sky-100 hover:to-cyan-200 rounded-xl border border-sky-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-h-[100px] sm:min-h-[120px]"
            >
              <div className="p-2.5 sm:p-3 bg-sky-500 rounded-full">
                <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center">Twitter/X</span>
            </button>

            {/* Copier le lien */}
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl border border-purple-200 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-h-[100px] sm:min-h-[120px]"
            >
              <div className="p-2.5 sm:p-3 bg-purple-500 rounded-full">
                <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center">Copier</span>
            </button>
          </div>

          {/* Partage natif si disponible */}
          {navigator.share ? (
            <>
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-500 text-center mb-3 sm:mb-4 px-2">
                  💡 Utilisez le partage natif pour voir toutes les applications installées sur votre téléphone
                </p>
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <Share2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-center">Partager via toutes les applications</span>
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 text-center px-2 leading-relaxed">
                ℹ️ Le partage natif n'est pas disponible sur cet appareil/navigateur. Utilisez les options ci-dessus.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal pour les paramètres */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Paramètres d'affichage"
        size="md"
      >
        <div className="flex flex-col gap-4 sm:gap-6">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Taille de la police pour l'affichage des chants
            </label>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-3">
              Cette taille s'appliquera uniquement lors de la lecture des paroles des chants.
            </p>
            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
              {[12, 14, 16, 18, 20, 24].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleFontSizeChange(size)}
                  className={`px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl transition-all text-sm sm:text-base font-medium min-w-[60px] sm:min-w-[70px] ${
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
        </div>
      </Modal>
    </header>
  )
}

export default Header