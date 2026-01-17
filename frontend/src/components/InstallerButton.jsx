import React, { useState, useEffect } from "react";
import logo_PraiseApp from "../assets/logo_praiseApp.png";
import { Download, X } from "lucide-react";

function InstallerButton() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Ne pas afficher si déjà installé (PWA en mode standalone)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || window.navigator.standalone === true
      || document.referrer.includes("android-app://");

    if (isStandalone) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setShowBanner(false);
    }

    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="sticky top-0 left-0 right-0 z-[100] flex items-center justify-between gap-4 px-4 sm:px-6 py-3 min-h-[64px] sm:min-h-[72px] bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200/60 animate-slideDown pointer-events-auto isolate"
      role="banner"
      aria-label="Installer PraiseApp"
    >
        {/* Logo + nom à gauche */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={logo_PraiseApp}
            alt="PraiseApp"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-lg shadow-md flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="font-bold text-gray-800 text-base sm:text-lg truncate block">
              PraiseApp
            </span>
            <span className="text-xs sm:text-sm text-gray-500 truncate block">
              Installez l'application
            </span>
          </div>
        </div>

        {/* Bouton Installer et Fermer à droite - bien au premier plan et cliquables */}
        <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
          <button
            type="button"
            onClick={handleInstallClick}
            className="relative z-10 flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-700/25 hover:shadow-xl hover:shadow-blue-700/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            <span className="pointer-events-none">Installer</span>
          </button>

          {/* Bouton fermer */}
          <button
            type="button"
            onClick={handleClose}
            className="relative z-10 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 pointer-events-none" />
          </button>
        </div>
    </div>
  );
}

export default InstallerButton;
