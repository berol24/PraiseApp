/**
 * Formate les erreurs pour afficher des messages conviviaux en français
 * @param {Error|Object} error - L'erreur à formater
 * @returns {string} - Message d'erreur formaté et convivial
 */
export function formatError(error) {
  // Vérifier si l'utilisateur est hors ligne
  if (!navigator.onLine) {
    return "Vous êtes hors ligne. Veuillez vérifier votre connexion Internet et réessayer.";
  }

  // Si c'est une erreur réseau (pas de réponse du serveur)
  if (!error.response) {
    // Erreurs de connexion réseau
    if (error.message?.includes("Network Error") || error.code === "ERR_NETWORK") {
      return "Impossible de se connecter au serveur. Vérifiez votre connexion Internet.";
    }
    
    // Erreurs de timeout
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return "La requête a pris trop de temps. Veuillez réessayer.";
    }

    // Erreurs DNS (comme ENOTFOUND pour MongoDB)
    if (error.message?.includes("ENOTFOUND") || error.message?.includes("getaddrinfo")) {
      return "Impossible de se connecter à la base de données. Le service est temporairement indisponible.";
    }

    // Erreurs de connexion générales
    if (error.message?.includes("Failed to fetch") || error.message?.includes("fetch")) {
      return "Erreur de connexion. Vérifiez votre connexion Internet et réessayer.";
    }

    // Message par défaut pour les erreurs réseau
    return "Erreur de connexion. Veuillez réessayer dans quelques instants.";
  }

  // Erreurs avec réponse du serveur
  const status = error.response?.status;
  const message = error.response?.data?.message || error.message || "";

  // Erreurs spécifiques selon le code HTTP
  switch (status) {
    case 400:
      return message || "Données invalides. Veuillez vérifier les informations saisies.";
    
    case 401:
      return message || "Vous n'êtes pas autorisé. Veuillez vous connecter.";
    
    case 403:
      return message || "Accès refusé. Vous n'avez pas les permissions nécessaires.";
    
    case 404:
      return message || "Ressource introuvable.";
    
    case 500:
      return "Erreur interne du serveur. Veuillez réessayer plus tard.";
    
    case 503:
      return "Service temporairement indisponible. Veuillez réessayer dans quelques instants.";
    
    case 504:
      return "Le serveur met trop de temps à répondre. Veuillez réessayer.";
    
    default:
      // Si le message contient des erreurs techniques, les remplacer
      if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
        return "Impossible de se connecter à la base de données. Le service est temporairement indisponible.";
      }
      
      if (message.includes("ECONNREFUSED") || message.includes("connect ECONNREFUSED")) {
        return "Le serveur est inaccessible. Veuillez réessayer dans quelques instants.";
      }
      
      if (message.includes("ETIMEDOUT") || message.includes("timeout")) {
        return "La connexion a expiré. Veuillez réessayer.";
      }
      
      // Retourner le message du serveur s'il est convivial, sinon un message générique
      if (message && !message.includes("Error") && !message.includes("error") && !message.match(/^[A-Z_]+$/)) {
        return message;
      }
      
      return "Une erreur est survenue. Veuillez réessayer.";
  }
}

/**
 * Vérifie si l'utilisateur est en ligne
 * @returns {boolean}
 */
export function isOnline() {
  return navigator.onLine;
}
