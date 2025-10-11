import  { useState, useEffect } from "react";
import {  useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import logo_PraiseApp from "./assets/logo_praiseApp.png";

const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });

export default function EditChant() {
  const { Idchant } = useParams();
  const navigate = useNavigate();
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChant() {
      if (!Idchant) return;

      setLoading(true);
      try {
        const res = await api.get(`/api/chants/${Idchant}`);
        const data = res.data;
        const categoriesStr = data.categories ? data.categories.join(", ") : "";
        const structureArray = Array.isArray(data.structure) ? data.structure : [];

        setForm({
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
        });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
     const token = localStorage.getItem("token");

      const categoriesArr = form.categories
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await api.put(`/api/chants/${Idchant}`, {
        ...form,
        categories: categoriesArr,
      },{
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Chant modifié avec succès !");
      navigate("/showChants");
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (<>
      <header className="bg-white shadow-md top-0 left-0 position-sticky z-10">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-4">
          <div className="flex items-center mb-3 sm:mb-0">
            <img
              src={logo_PraiseApp} 
              alt="logo_PraiseApp"
              className="h-20 w-20 mr-3"
            />
            {/* Petit écran - titre à côté */}
            <h1 className="text-2xl font-bold text-gray-700 sm:hidden">
              Modifier le Chant
            </h1>
          </div>
          {/* Titre central sur écrans moyens et plus */}
          <h1 className="hidden sm:block text-3xl font-bold text-center text-gray-700 flex-grow">
         Modifier le Chant
          </h1>
    
          {/* Bouton déconnexion */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition w-full sm:w-auto mt-3 sm:mt-0"
          >
            Déconnexion
          </button>
        </div>
      </header>
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12 mb-12">

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      {loading && <p className="text-center mb-4">Chargement...</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {["titre", "auteur", "langue", "categories", "rythme"].map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="border p-3 rounded-lg w-full text-lg"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required={key === "titre"}
          />
        ))}

        {/* Structure du chant */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-2xl mb-4">Structure</h3>
          {form.structure.map((part, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-3 mb-4 items-center"
            >
              <select
                className="border p-2 rounded-lg w-full sm:w-1/4"
                value={part.type}
                onChange={(e) => updatePart(index, "type", e.target.value)}
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
                className="border p-2 rounded-lg w-full sm:w-1/6"
                value={part.numero}
                onChange={(e) =>
                  updatePart(index, "numero", parseInt(e.target.value) || 1)
                }
              />
              <input
                type="text"
                placeholder="Contenu"
                className="border p-2 rounded-lg w-full sm:w-2/3"
                value={part.contenu}
                onChange={(e) => updatePart(index, "contenu", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removePart(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg mt-2 sm:mt-0"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPart}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            + Ajouter une partie
          </button>
        </div>

        {/* Fichiers */}
        <div className="border-t pt-4 mt-6">
          <h3 className="font-semibold text-2xl mb-4">Fichiers</h3>
          {Object.entries(form.fichiers).map(([key, val]) => (
            <input
              key={key}
              type="text"
              placeholder={`URL ${key.replace("_", " ").toUpperCase()}`}
              className="border p-3 rounded-lg w-full mb-4"
              value={val}
              onChange={(e) =>
                setForm({
                  ...form,
                  fichiers: { ...form.fichiers, [key]: e.target.value },
                })
              }
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold px-6 py-3 rounded-lg transition`}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
         <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg flex-1"
            >
              Annuler
            </button>
      </form>
    </div></>
  );
}
