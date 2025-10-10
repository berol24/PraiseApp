import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl});

export default function AddChant({ onClose, onAdded, user }) {
  const [form, setForm] = useState({
    titre: "",
    auteur: "",
    langue: "français",
    categories: "",
    rythme: "",
    fichiers: { partition_pdf: "", audio_mp3: "", video_youtube: "" },
    structure: [{ type: "couplet", numero: 1, contenu: "" }]
  });
  const [error, setError] = useState("");

  // Ajouter une nouvelle partie (couplet/refrain/etc)
  const addPart = () => {
    setForm({
      ...form,
      structure: [...form.structure, { type: "couplet", numero: form.structure.length + 1, contenu: "" }]
    });
    console.log(form);
    
  };

  // Supprimer une partie
  const removePart = (index) => {
    const updated = form.structure.filter((_, i) => i !== index);
    setForm({ ...form, structure: updated });
  };

  // Modifier une partie
  const updatePart = (index, field, value) => {
    const updated = [...form.structure];
    updated[index][field] = value;
    setForm({ ...form, structure: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const data = {
        ...form,
        categories: form.categories.split(",").map(c => c.trim())
      };
      await api.post("/api/chants", data, { headers: { Authorization: `Bearer ${token}` } });
      
      
      onAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout du chant");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Ajouter un Chant</h2>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Titre"
            className="border p-2 rounded-lg w-full"
            value={form.titre}
            onChange={e => setForm({ ...form, titre: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Auteur"
            className="border p-2 rounded-lg w-full"
            value={form.auteur}
            onChange={e => setForm({ ...form, auteur: e.target.value })}
          />
          <input
            type="text"
            placeholder="Langue"
            className="border p-2 rounded-lg w-full"
            value={form.langue}
            onChange={e => setForm({ ...form, langue: e.target.value })}
          />
          <input
            type="text"
            placeholder="Catégories (séparées par ,)"
            className="border p-2 rounded-lg w-full"
            value={form.categories}
            onChange={e => setForm({ ...form, categories: e.target.value })}
          />
          <input
            type="text"
            placeholder="Rythme"
            className="border p-2 rounded-lg w-full"
            value={form.rythme}
            onChange={e => setForm({ ...form, rythme: e.target.value })}
          />

          {/* Structure du chant */}
          <div className="border-t pt-4 mt-2">
            <h3 className="font-semibold text-lg mb-2">Structure</h3>
            {form.structure.map((part, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:gap-2 mb-2">
                <select
                  className="border p-2 rounded-lg w-full sm:w-1/4"
                  value={part.type}
                  onChange={e => updatePart(index, "type", e.target.value)}
                >
                  <option value="couplet">Couplet</option>
                  <option value="refrain">Refrain</option>
                  <option value="solo">Solo</option>
                  <option value="pont">Pont</option>
                  <option value="autre">Autre</option>
                </select>
                <input
                  type="number"
                  min="1"
                  placeholder="Numéro"
                  className="border p-2 rounded-lg w-full sm:w-1/6"
                  value={part.numero}
                  onChange={e => updatePart(index, "numero", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Contenu"
                  className="border p-2 rounded-lg w-full sm:w-2/3"
                  value={part.contenu}
                  onChange={e => updatePart(index, "contenu", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removePart(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg mt-2 sm:mt-0"
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPart}
              className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
            >
              + Ajouter une partie
            </button>
          </div>

          {/* Fichiers */}
          <div className="border-t pt-4 mt-2">
            <h3 className="font-semibold text-lg mb-2">Fichiers</h3>
            <input
              type="text"
              placeholder="URL Partition PDF"
              className="border p-2 rounded-lg w-full mb-2"
              value={form.fichiers.partition_pdf}
              onChange={e => setForm({ ...form, fichiers: { ...form.fichiers, partition_pdf: e.target.value } })}
            />
            <input
              type="text"
              placeholder="URL Audio MP3"
              className="border p-2 rounded-lg w-full mb-2"
              value={form.fichiers.audio_mp3}
              onChange={e => setForm({ ...form, fichiers: { ...form.fichiers, audio_mp3: e.target.value } })}
            />
            <input
              type="text"
              placeholder="URL Vidéo YouTube"
              className="border p-2 rounded-lg w-full"
              value={form.fichiers.video_youtube}
              onChange={e => setForm({ ...form, fichiers: { ...form.fichiers, video_youtube: e.target.value } })}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1">
              Ajouter
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
