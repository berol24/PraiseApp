import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/FormatDate";
import { handleDownloadPDF } from "../utils/HandleDownloadPDF";
import api from "../services/api";
function ShowDetailChant() {
  const Idchant = useParams().Idchant;
  const [mesChants, setMesChants] = useState(null);
  const [loading, setLoading] = useState(true);
  const structure = mesChants ? mesChants.structure : [];
  const titre = mesChants ? mesChants.titre : "";
  const sortedStructure = [...structure].sort((a, b) => a.numero - b.numero);

  useEffect(() => {
    if (!Idchant) return;

    async function fetchChant() {
      setLoading(true);
      try {
        const res = await api.get(`/api/chants/${Idchant}`);
        setMesChants(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du chant :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChant();
  }, [Idchant]);

  if (loading) return <p>Chargement...</p>;
  if (!mesChants) return <p>Produit introuvable</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        Titre : {mesChants.titre || "Pas spécifique"}
      </h1>

      <div className="mb-4 text-gray-700">
        <p>
          <span className="font-semibold">Auteur :</span> {mesChants.auteur || "Pas spécifique"}
        </p>
        <p>
          <span className="font-semibold">Langue :</span> {mesChants.langue || "Pas spécifique"}
        </p>
        <p>
          <span className="font-semibold">Rythme :</span> {mesChants.rythme || "Pas spécifique"}
        </p>
        <p>
          <span className="font-semibold">Catégories :</span>{" "}
          {mesChants.categories.join(", ") || "Pas spécifique"}
        </p>
      </div>

      <div className="mb-6 text-gray-600">
        <p>
          <span className="font-semibold">Date de création :</span>{" "}
          {formatDate(mesChants.date_creation) || "Pas spécifique"}
        </p>
        <p>
          <span className="font-semibold">Mise à jour :</span>{" "}
          {formatDate(mesChants.date_mise_a_jour) || "Pas spécifique"}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Fichiers</h2>

        <ul className="list-none ml-2 sm:ml-5 text-blue-600 space-y-3">
          {/* PARTITION PDF */}
          {mesChants.fichiers.partition_pdf && (
            <li className="flex flex-wrap items-center gap-3">
              <button
                onClick={() =>
                  window.open(mesChants.fichiers.partition_pdf, "_blank")
                }
                className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center"
              >
                Partition PDF
              </button>

              <button
                onClick={() => {
                  const message = `Voici la partition PDF du chant "${titre}" : ${mesChants.fichiers.partition_pdf}`;
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
                  window.open(whatsappUrl, "_blank");
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center"
              >
                Partager le lien sur WhatsApp
              </button>
            </li>
          )}

          {/* AUDIO MP3 */}
          {mesChants.fichiers.audio_mp3 && (
            <li className="flex flex-wrap items-center gap-3">
              <button
                onClick={() =>
                  window.open(mesChants.fichiers.audio_mp3, "_blank")
                }
                className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center"
              >
                Audio MP3
              </button>

              <button
                onClick={() => {
                  const message = `Voici l'audio du chant "${titre}" : ${mesChants.fichiers.audio_mp3}`;
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
                  window.open(whatsappUrl, "_blank");
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center"
              >
                Partager le lien sur WhatsApp
              </button>
            </li>
          )}

          {/* VIDÉO YOUTUBE */}
          {mesChants.fichiers.video_youtube && (
            <li className="flex flex-wrap items-center gap-3">
              <button
                onClick={() =>
                  window.open(mesChants.fichiers.video_youtube, "_blank")
                }
                className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center"
              >
                Vidéo YouTube
              </button>

              <button
                onClick={() => {
                  const message = `Voici la vidéo YouTube du chant "${titre}" : ${mesChants.fichiers.video_youtube}`;
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
                  window.open(whatsappUrl, "_blank");
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center"
              >
                Partager le lien sur WhatsApp
              </button>
            </li>
          )}

          {/* --- BOUTON GLOBAL --- */}
          <li className="pt-3 border-t border-gray-300 flex  items-center gap-3">
            <button
              onClick={()=>handleDownloadPDF (mesChants,sortedStructure)}
              className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center"
            >
              Télécharger les paroles en PDF
            </button>
            <button
              onClick={() => {
                const messagesortedStructure = sortedStructure
                  .map(
                    ({ type, numero, contenu }) =>
                      `${type} ${numero}\n${contenu}`
                  )
                  .join("\n\n");

                const message = `Voici les paroles du chant "${titre}" :\n\n${messagesortedStructure}`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
                window.open(whatsappUrl, "_blank");
              }}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition mt-2"
            >
              Partager Parole sur WhatsApp
            </button>
          </li>
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
