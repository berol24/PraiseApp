import React, { useState, useEffect } from 'react';
import download from "../assets/download.png";

function InstallerButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Logique pour détecter si l'app est installée (ex: PWA)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // Empêche l'affichage automatique
      setShowButton(true); // Affiche le bouton si on peut installer
      
      // Cache le bouton après 5 secondes
      setTimeout(() => {
        setShowButton(false);
      }, 5000);
    });
  }, []);

  const handleInstallClick = () => {
    // Logique d'installation (ex: déclencher prompt)
    alert('Installation lancée');
  };

  if (!showButton) return null;
const style={
        position: 'fixed', 
        top: '10px',      
        left: '50%',      
        transform: 'translateX(-50%)',
        display: 'flex', 
        alignItems: 'center', 
        gap: '5px', 
        zIndex: 1000,    
        padding: '8px 15px',
        backgroundColor: '#fff',
        color: 'black',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      }
  return (
    <button onClick={handleInstallClick} style={style}>
      <span>Installer</span>
      <img src={download} alt="download_installation" className="w-5 h-5" />
    </button>
  );
}

export default InstallerButton;
