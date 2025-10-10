import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
function ShowDetailChant() {
  const Idchant = useParams().Idchant;
  const [mesChants, setMesChants] = useState(null);
  const [loading, setLoading] = useState(true);
  const structure = mesChants ? mesChants.structure : [];
  const sortedStructure = [...structure].sort((a, b) => a.numero - b.numero);

  useEffect(() => {
    if (!Idchant) return;

    setLoading(true);
    fetch(`${apiUrl}/api/chants/${Idchant}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
        setMesChants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement du chant :", err);
        setLoading(false);
      });
  }, [Idchant]);

  if (loading) return <p>Chargement...</p>;
  if (!mesChants) return <p>Produit introuvable</p>;

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        Titre : {mesChants.titre}
      </h1>

      <div className="mb-4 text-gray-700">
        <p>
          <span className="font-semibold">Auteur :</span> {mesChants.auteur}
        </p>
        <p>
          <span className="font-semibold">Langue :</span> {mesChants.langue}
        </p>
        <p>
          <span className="font-semibold">Rythme :</span> {mesChants.rythme}
        </p>
        <p>
          <span className="font-semibold">Catégories :</span>{" "}
          {mesChants.categories.join(", ")}
        </p>
      </div>

      <div className="mb-6 text-gray-600">
        <p>
          <span className="font-semibold">Date de création :</span>{" "}
          {formatDate(mesChants.date_creation)}
        </p>
        <p>
          <span className="font-semibold">Mise à jour :</span>{" "}
          {formatDate(mesChants.date_mise_a_jour)}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Fichiers</h2>
        <ul className="list-disc ml-5 text-blue-600 space-y-2">
          {mesChants.fichiers.partition_pdf && (
            <li>
              <a
                href={mesChants.fichiers.partition_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Partition PDF
              </a>
            </li>
          )}
          {mesChants.fichiers.audio_mp3 && (
            <li>
              <a
                href={mesChants.fichiers.audio_mp3}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Audio MP3
              </a>
            </li>
          )}
          {mesChants.fichiers.video_youtube && (
            <li>
              <a
                href={mesChants.fichiers.video_youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Vidéo YouTube
              </a>
            </li>
          )}
        </ul>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Paroles</h2>

        <div className="space-y-8">
          {sortedStructure.map(({ _id, type, numero, contenu }) => (
            <div key={_id} className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-bold text-blue-700 mb-2 capitalize">
                {type} {numero}
              </h3>
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {contenu}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShowDetailChant;
