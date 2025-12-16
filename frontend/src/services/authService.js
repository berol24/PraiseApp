/* Simple auth service: token storage, decoding, expiry check, fetch wrapper */
function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

function getToken() {
  return localStorage.getItem("token");
}

function removeToken() {
  localStorage.removeItem("token");
}

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp <= now;
}

class AuthError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

async function fetchWithAuth(url, opts = {}) {
  if (!navigator.onLine) throw new Error("Hors ligne — vérifiez votre connexion Internet");

  const token = getToken();
  if (token && isTokenExpired(token)) {
    removeToken();
    throw new AuthError("Token expiré", "TOKEN_EXPIRED");
  }

  const headers = new Headers(opts.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");

  const response = await fetch(url, { ...opts, headers });

  if (response.status === 401) {
    // invalid token or unauthorized
    removeToken();
    throw new AuthError("Non autorisé", "UNAUTHORIZED");
  }

  return response;
}

export { setToken, getToken, removeToken, decodeToken, isTokenExpired, fetchWithAuth, AuthError };
