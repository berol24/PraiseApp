import axios from "axios";
import { getToken, removeToken } from "./authService";
import { toast } from "./toast";
import { formatError, isOnline } from "../utils/errorFormatter";

// En développement, utiliser le proxy Vite (baseURL vide)
// En production, utiliser la variable d'environnement ou l'URL complète
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:5000');
const api = axios.create({ baseURL: API_URL });

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
        // network or CORS error - utiliser formatError pour un message convivial
        const errorMessage = formatError(error);
        // Ne pas afficher de toast ici, laisser les composants gérer l'affichage
        return Promise.reject(new Error(errorMessage));
    }
    if (error.response.status === 401) {
      removeToken();
      toast("Session expirée — reconnectez-vous", "warning");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
