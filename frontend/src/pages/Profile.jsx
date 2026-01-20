import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Trash2, Save, X, Edit, XCircle, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import Button from "../components/common/Button";
import ConfirmModal from "../components/common/ConfirmModal";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { formatError, isOnline } from "../utils/errorFormatter";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/login");
    const userData = JSON.parse(storedUser);
    setUser(userData);
    const profileData = {
      nom: userData.nom || "",
      email: userData.email || "",
      mot_de_passe: "",
      confirmPassword: "",
    };
    setForm(profileData);
    setOriginalProfile({ nom: userData.nom || "", email: userData.email || "" });
  }, [navigate]);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelProfile = () => {
    if (originalProfile) {
      setForm({ ...form, nom: originalProfile.nom, email: originalProfile.email });
    }
    setIsEditingProfile(false);
    setError("");
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
    setForm({ ...form, mot_de_passe: "", confirmPassword: "" });
  };

  const handleCancelPassword = () => {
    setIsEditingPassword(false);
    setForm({ ...form, mot_de_passe: "", confirmPassword: "" });
    setError("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const updateData = {
        nom: form.nom,
        email: form.email,
      };

      const res = await api.put(`/api/users/${user._id}`, updateData);
      const updatedUser = res.data;
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setOriginalProfile({ nom: updatedUser.nom, email: updatedUser.email });
      setSuccess("Profil mis à jour avec succès !");
      setIsEditingProfile(false);
    } catch (err) {
      const errorMessage = formatError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!form.mot_de_passe || form.mot_de_passe !== form.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        setLoading(false);
        return;
      }

      const updateData = {
        mot_de_passe: form.mot_de_passe,
      };

      await api.put(`/api/users/${user._id}`, updateData);
      setSuccess("Mot de passe mis à jour avec succès !");
      setIsEditingPassword(false);
      setForm({ ...form, mot_de_passe: "", confirmPassword: "" });
    } catch (err) {
      const errorMessage = formatError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/api/users/${user._id}`);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      logout(false); // Déconnexion sans redirection automatique
      setShowDeleteModal(false);
      navigate("/login");
    } catch (err) {
      const errorMessage = formatError(err);
      setError(errorMessage);
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-yellow-50">
      <Header user={user} navigate={navigate} titre="Mon Profil" />
      
      <main className="container mx-auto p-6 sm:p-8 md:p-10 max-w-2xl">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent">
              Mon Profil
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-700 text-sm animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm animate-fadeIn">
              {success}
            </div>
          )}

          {/* Section Profil (Nom et Email) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-700" />
                Informations personnelles
              </h3>
              {!isEditingProfile ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleEditProfile}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelProfile}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Annuler
                </Button>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Nom
                </label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className={`w-full border-2 p-3 rounded-xl transition-all ${
                    isEditingProfile
                      ? "border-gray-200 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 bg-white"
                      : "border-transparent bg-gray-50 cursor-not-allowed"
                  }`}
                  disabled={!isEditingProfile}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full border-2 p-3 rounded-xl transition-all ${
                    isEditingProfile
                      ? "border-gray-200 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 bg-white"
                      : "border-transparent bg-gray-50 cursor-not-allowed"
                  }`}
                  disabled={!isEditingProfile}
                  required
                />
              </div>

              {isEditingProfile && (
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Section Mot de passe */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-700" />
                Mot de passe
              </h3>
              {!isEditingPassword ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleEditPassword}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelPassword}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Annuler
                </Button>
              )}
            </div>

            {isEditingPassword ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4" />
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={form.mot_de_passe}
                    onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                    placeholder="Nouveau mot de passe"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4" />
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                    placeholder="Confirmer le mot de passe"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-600 text-sm">Le mot de passe est masqué pour des raisons de sécurité.</p>
              </div>
            )}
          </div>

          {/* Bouton Supprimer */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer mon compte"
        message="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues."
        confirmText={loading ? "Suppression..." : "Oui, supprimer"}
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
