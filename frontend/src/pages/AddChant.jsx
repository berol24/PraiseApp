

import React, { useState } from "react";
import { X, Plus, AlertCircle, ChevronUp, ChevronDown } from "lucide-react";
import api from "../services/api";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import LanguageSelect from "../components/common/LanguageSelect";
import { toast } from "../services/toast";
import { formatError, isOnline } from "../utils/errorFormatter";

export default function AddChant({ onClose, onAdded }) {
  const [form, setForm] = useState({
    titre: "",
    auteur: "",
    langue: "Français",
    categories: "",
    rythme: "",
    fichiers: { partition_pdf: "", audio_mp3: "", video_youtube: "" },
    structure: [{ type: "couplet", numero: 1, contenu: "" }]
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** Ajouter une nouvelle partie */
  const addPart = () => {
    setForm(prev => ({
      ...prev,
      structure: [
        ...prev.structure,
        { type: "couplet", numero: prev.structure.length + 1, contenu: "" }
      ]
    }));
  };

  /** Supprimer une partie */
  const removePart = (index) => {
    const updated = form.structure.filter((_, i) => i !== index);
    setForm({ ...form, structure: updated });
  };

  /** Déplacer une partie vers le haut ou le bas */
  const movePart = (index, direction) => {
    const arr = [...form.structure];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= arr.length) return;
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    setForm({ ...form, structure: arr });
  };

  /** Modifier une partie */
  const updatePart = (index, field, value) => {
    const updated = [...form.structure];
    updated[index][field] = value;
    setForm({ ...form, structure: updated });
  };

  /** Soumission du formulaire */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.titre.trim()) return setError("Le titre est obligatoire");

    if (!isOnline()) {
      setError("Vous êtes hors ligne. Veuillez vérifier votre connexion Internet.");
      return;
    }

    try {
      setLoading(true);
      const data = {
        ...form,
        categories: form.categories
          ? form.categories.split(",").map(c => c.trim())
          : []
      };

      await api.post("/api/chants", data);

      toast("Chant ajouté avec succès !", "success");
      onAdded();
      onClose();
    } catch (err) {
      const errorMessage = formatError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Ajouter un Chant" size="xl">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-700 text-sm animate-fadeIn">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium">{error}</span>
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
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required={key === "titre"}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Langue
          </label>
          <LanguageSelect
            value={form.langue}
            onChange={(lang) => setForm({ ...form, langue: lang })}
          />
        </div>

        {/* Structure du chant */}
        <div className="border-t border-gray-200 pt-5 mt-2">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Structure du chant</h3>
          {form.structure.map((part, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:gap-3 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-0 sm:flex-nowrap">
                <select
                  className="border-2 border-gray-200 p-2 rounded-xl w-full sm:w-auto min-w-[120px] focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                  value={part.type}
                  onChange={(e) => updatePart(index, "type", e.target.value)}
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
                  className="border-2 border-gray-200 p-2 rounded-xl w-16 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                  value={part.numero}
                  onChange={(e) =>
                    updatePart(index, "numero", parseInt(e.target.value) || 1)
                  }
                />
                <div className="flex flex-col rounded-lg overflow-hidden border border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={() => movePart(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
                    title="Monter"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => movePart(index, "down")}
                    disabled={index === form.structure.length - 1}
                    className="p-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 border-t border-gray-200"
                    title="Descendre"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea
                placeholder="Contenu"
                rows="3"
                className="border-2 border-gray-200 p-2 rounded-xl flex-1 min-w-0 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 resize-none"
                value={part.contenu}
                onChange={(e) => updatePart(index, "contenu", e.target.value)}
              />

              <button
                type="button"
                onClick={() => removePart(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition-all shadow-md hover:shadow-lg sm:self-center flex items-center justify-center flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addPart}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl mt-2 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une partie
          </button>
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
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all"
                value={val}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fichiers: { ...form.fichiers, [key]: e.target.value }
                  })
                }
              />
            </div>
          ))}
        </div>

        {/* Boutons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Ajout en cours..." : "Ajouter le chant"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
}
