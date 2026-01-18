import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Plus, Edit, Save, XCircle } from "lucide-react";
import api from "../services/api";
import Header from "../components/Header";
import Button from "../components/common/Button";
import LanguageSelect from "../components/common/LanguageSelect";
import { toast } from "../services/toast";
import { formatDate } from "../utils/FormatDate";

export default function EditChant() {
  const { Idchant } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState(null);
  const [form, setForm] = useState({
    titre: "",
    auteur: "",
    langue: "",
    categories: "",
    rythme: "",
    structure: [],
    fichiers: {
      partition_pdf: "",
      audio_mp3: "",
      video_youtube: "",
    },
    date_creation: null,
    date_mise_a_jour: null,
    modifie_par: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    async function fetchChant() {
      if (!Idchant) return;

      setLoading(true);
      try {
        const res = await api.get(`/api/chants/${Idchant}`);
        const data = res.data;
        const categoriesStr = data.categories ? data.categories.join(", ") : "";
        const structureArray = Array.isArray(data.structure) ? data.structure : [];

        const formData = {
          titre: data.titre || "",
          auteur: data.auteur || "",
          langue: data.langue || "",
          categories: categoriesStr,
          rythme: data.rythme || "",
          structure: structureArray,
          fichiers: {
            partition_pdf: data.fichiers?.partition_pdf || "",
            audio_mp3: data.fichiers?.audio_mp3 || "",
            video_youtube: data.fichiers?.video_youtube || "",
          },
          date_creation: data.date_creation,
          date_mise_a_jour: data.date_mise_a_jour,
          modifie_par: data.modifie_par,
        };
        setForm(formData);
        setOriginalForm(JSON.parse(JSON.stringify(formData)));
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement du chant");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchChant();
  }, [Idchant]);

  const updatePart = (index, key, value) => {
    const updatedStructure = [...form.structure];
    updatedStructure[index] = { ...updatedStructure[index], [key]: value };
    setForm({ ...form, structure: updatedStructure });
  };

  const removePart = (index) => {
    const updatedStructure = form.structure.filter((_, i) => i !== index);
    setForm({ ...form, structure: updatedStructure });
  };

  const addPart = () => {
    setForm({
      ...form,
      structure: [
        ...form.structure,
        { type: "couplet", numero: form.structure.length + 1, contenu: "" },
      ],
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalForm) {
      setForm(JSON.parse(JSON.stringify(originalForm)));
    }
    setIsEditing(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const categoriesArr = form.categories
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await api.put(`/api/chants/${Idchant}`, {
        ...form,
        categories: categoriesArr,
      });

      // Recharger les données depuis le serveur pour obtenir modifie_par avec le nom
      const res = await api.get(`/api/chants/${Idchant}`);
      const data = res.data;
      const categoriesStr = data.categories ? data.categories.join(", ") : "";
      const structureArray = Array.isArray(data.structure) ? data.structure : [];

      const updatedFormData = {
        titre: data.titre || "",
        auteur: data.auteur || "",
        langue: data.langue || "",
        categories: categoriesStr,
        rythme: data.rythme || "",
        structure: structureArray,
        fichiers: {
          partition_pdf: data.fichiers?.partition_pdf || "",
          audio_mp3: data.fichiers?.audio_mp3 || "",
          video_youtube: data.fichiers?.video_youtube || "",
        },
        date_creation: data.date_creation,
        date_mise_a_jour: data.date_mise_a_jour,
        modifie_par: data.modifie_par,
      };
      
      setForm(updatedFormData);
      setOriginalForm(JSON.parse(JSON.stringify(updatedFormData)));

      toast("Chant modifié avec succès !", "success");
      setIsEditing(false);
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-yellow-50">
      <Header user={user} navigate={navigate} titre="Modifier le Chant" />
      
      <main className="container mx-auto p-6 sm:p-8 md:p-10 max-w-4xl">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center animate-fadeIn">
              {error}
            </div>
          )}
          {loading && (
            <div className="mb-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-800 mx-auto mb-2"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent">
              Détails du Chant
            </h2>
            {!isEditing ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Annuler
                </Button>
              </div>
            )}
          </div>

          {/* Informations de modification - visible uniquement pour les admins */}
          {user?.role === "admin" && (
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="text-sm text-gray-600 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
                <span>
                  <span className="font-semibold">Créé le :</span> {form.date_creation ? formatDate(form.date_creation) : "Non spécifié"}
                </span>
                <span>
                  <span className="font-semibold">Mis à jour le :</span> {form.date_mise_a_jour ? formatDate(form.date_mise_a_jour) : "Non spécifié"}
                  {form.modifie_par?.nom && (
                    <span className="ml-2 text-blue-700 font-semibold">par {form.modifie_par.nom}</span>
                  )}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {["titre", "auteur", "categories", "rythme"].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  className={`w-full border-2 p-3 rounded-xl transition-all ${
                    isEditing
                      ? "border-gray-200 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 bg-white"
                      : "border-transparent bg-gray-50 cursor-not-allowed"
                  }`}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  disabled={!isEditing}
                  required={key === "titre"}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue
              </label>
              {isEditing ? (
                <LanguageSelect
                  value={form.langue}
                  onChange={(lang) => setForm({ ...form, langue: lang })}
                />
              ) : (
                <div className="w-full border-2 border-transparent bg-gray-50 p-3 rounded-xl text-gray-800">
                  {form.langue || "Non spécifiée"}
                </div>
              )}
            </div>

            {/* Structure du chant */}
            <div className="border-t border-gray-200 pt-5 mt-2">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Structure du chant</h3>
              {form.structure.map((part, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-3 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <select
                    className={`border-2 p-2 rounded-xl w-full sm:w-1/4 mb-2 sm:mb-0 ${
                      isEditing
                        ? "border-gray-200 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 bg-white"
                        : "border-transparent bg-gray-50 cursor-not-allowed"
                    }`}
                    value={part.type}
                    onChange={(e) => updatePart(index, "type", e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="couplet">Couplet</option>
                    <option value="refrain">Refrain</option>
                    <option value="solo">Solo</option>
                    <option value="ass">Ass</option>
                    <option value="autre">Autre</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    className={`border-2 p-2 rounded-xl w-full sm:w-1/6 mb-2 sm:mb-0 ${
                      isEditing
                        ? "border-gray-200 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 bg-white"
                        : "border-transparent bg-gray-50 cursor-not-allowed"
                    }`}
                    value={part.numero}
                    onChange={(e) =>
                      updatePart(index, "numero", parseInt(e.target.value) || 1)
                    }
                    disabled={!isEditing}
                  />
                  <textarea
                    placeholder="Contenu"
                    rows="3"
                    className={`border-2 p-2 rounded-xl w-full sm:w-2/3 mb-2 sm:mb-0 resize-none ${
                      isEditing
                        ? "border-gray-200 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 bg-white"
                        : "border-transparent bg-gray-50 cursor-not-allowed"
                    }`}
                    value={part.contenu}
                    onChange={(e) => updatePart(index, "contenu", e.target.value)}
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removePart(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition-all shadow-md hover:shadow-lg sm:self-center flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  type="button"
                  onClick={addPart}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une partie
                </button>
              )}
            </div>

            {/* Fichiers */}
            <div className="border-t border-gray-200 pt-5 mt-2">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Fichiers (URLs)</h3>
              {Object.entries(form.fichiers).map(([key, val]) => (
                <div key={key} className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    placeholder={`URL ${key.replace("_", " ").toUpperCase()}`}
                    className={`w-full border-2 p-3 rounded-xl transition-all ${
                      isEditing
                        ? "border-gray-200 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 bg-white"
                        : "border-transparent bg-gray-50 cursor-not-allowed"
                    }`}
                    value={val}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fichiers: { ...form.fichiers, [key]: e.target.value },
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>

            {/* Boutons */}
            {isEditing && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
