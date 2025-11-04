import React, { useState, useEffect } from "react";
import download from "../assets/download.png";

function InstallerButton() {
  const [showButton, setShowButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      // Stocke l'événement pour déclenchement plus tard
      setDeferredPrompt(e);
      setShowButton(true);

      // Cache le bouton après 5 secondes
      setTimeout(() => {
        setShowButton(false);
      }, 5000);
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
      console.log("Installation acceptée");
    } else {
      console.log("Installation refusée");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <button onClick={handleInstallClick} className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-b-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 flex items-center justify-between gap-2 w-[80%] md:w-auto">
      <span>Installer</span>
      <img src={download} alt="download_installation" className="w-5 h-5" />
    </button>
  );
}

export default InstallerButton;
