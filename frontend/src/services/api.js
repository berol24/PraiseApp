import axios from "axios";
import { getToken, removeToken } from "./authService";
import { toast } from "./toast";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

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
        // network or CORS error
        toast("Hors ligne — vérifiez votre connexion Internet", "danger");
        return Promise.reject(new Error("Hors ligne — vérifiez votre connexion Internet"));
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
