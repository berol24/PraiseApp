

import React, { useState } from "react";
import api from "../services/api";

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
    const updated = form.structure
      .filter((_, i) => i !== index)
      .map((part, i) => ({ ...part, numero: i + 1 }));
    setForm({ ...form, structure: updated });
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

    try {
      setLoading(true);
      const data = {
        ...form,
        categories: form.categories
          ? form.categories.split(",").map(c => c.trim())
          : []
      };

      await api.post("/api/chants", data);

      onAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout du chant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Ajouter un Chant
        </h2>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {["titre", "auteur", "langue", "categories", "rythme"].map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="border p-2 rounded-lg w-full"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required={key === "titre"}
            />
          ))}

          {/* Structure du chant */}
          <div className="border-t pt-4 mt-2">
            <h3 className="font-semibold text-lg mb-2">Structure</h3>
            {form.structure.map((part, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:gap-2 mb-2 items-center"
              >
                <select
                  className="border p-2 rounded-lg w-full sm:w-1/4"
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
                  className="border p-2 rounded-lg w-full sm:w-1/6"
                  value={part.numero}
                  onChange={(e) =>
                    updatePart(index, "numero", parseInt(e.target.value))
                  }
                />

                <textarea
                  type="text"
                  placeholder="Contenu"
                  className="border p-2 rounded-lg w-full sm:w-2/3"
                  value={part.contenu}
                  onChange={(e) => updatePart(index, "contenu", e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => removePart(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg mt-2 sm:mt-0"
                >
                  Supprimer
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addPart}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mt-2"
            >
              + Ajouter une partie
            </button>
          </div>

          {/* Fichiers */}
          <div className="border-t pt-4 mt-2">
            <h3 className="font-semibold text-lg mb-2">Fichiers</h3>
            {Object.entries(form.fichiers).map(([key, val]) => (
              <input
                key={key}
                type="text"
                placeholder={`URL ${key.replace("_", " ").toUpperCase()}`}
                className="border p-2 rounded-lg w-full mb-2"
                value={val}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fichiers: { ...form.fichiers, [key]: e.target.value }
                  })
                }
              />
            ))}
          </div>

          {/* Boutons */}
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
              } text-white px-4 py-2 rounded-lg flex-1`}
            >
              {loading ? "Ajout en cours..." : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg flex-1"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
