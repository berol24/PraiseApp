import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Music, Video, Download, Share2, File } from "lucide-react";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!mesChants) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-50 to-yellow-50">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl font-semibold text-gray-700">Chant introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent mb-6">
          {mesChants.titre || "Pas de titre"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-gray-600 mb-1">Auteur</p>
            <p className="font-semibold text-gray-800">{mesChants.auteur || "Non spécifié"}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <p className="text-sm text-gray-600 mb-1">Langue</p>
            <p className="font-semibold text-gray-800">{mesChants.langue || "Non spécifiée"}</p>
          </div>
          {mesChants.rythme && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-sm text-gray-600 mb-1">Rythme</p>
              <p className="font-semibold text-gray-800">{mesChants.rythme}</p>
            </div>
          )}
          {mesChants.categories && mesChants.categories.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Catégories</p>
              <p className="font-semibold text-gray-800">{mesChants.categories.join(", ")}</p>
            </div>
          )}
        </div>

        <div className="mb-6 text-sm text-gray-600 flex flex-wrap gap-4">
          <span>
            <span className="font-semibold">Créé le :</span> {formatDate(mesChants.date_creation) || "Non spécifié"}
          </span>
          <span>
            <span className="font-semibold">Mis à jour le :</span> {formatDate(mesChants.date_mise_a_jour) || "Non spécifié"}
          </span>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <File className="w-6 h-6 text-blue-700" />
            Fichiers
          </h2>

          <div className="space-y-3">
            {/* PARTITION PDF */}
            {mesChants.fichiers.partition_pdf && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      window.open(mesChants.fichiers.partition_pdf, "_blank")
                    }
                    className="flex-1 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Partition PDF
                  </button>
                  <button
                    onClick={() => {
                      const message = `Voici la partition PDF du chant "${titre}" : ${mesChants.fichiers.partition_pdf}`;
                      const encodedMessage = encodeURIComponent(message);
                      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager sur WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* AUDIO MP3 */}
            {mesChants.fichiers.audio_mp3 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      window.open(mesChants.fichiers.audio_mp3, "_blank")
                    }
                    className="flex-1 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Music className="w-4 h-4" />
                    Audio MP3
                  </button>
                  <button
                    onClick={() => {
                      const message = `Voici l'audio du chant "${titre}" : ${mesChants.fichiers.audio_mp3}`;
                      const encodedMessage = encodeURIComponent(message);
                      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager sur WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* VIDÉO YOUTUBE */}
            {mesChants.fichiers.video_youtube && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      window.open(mesChants.fichiers.video_youtube, "_blank")
                    }
                    className="flex-1 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Vidéo YouTube
                  </button>
                  <button
                    onClick={() => {
                      const message = `Voici la vidéo YouTube du chant "${titre}" : ${mesChants.fichiers.video_youtube}`;
                      const encodedMessage = encodeURIComponent(message);
                      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager sur WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* BOUTONS GLOBAUX */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <button
                onClick={()=>handleDownloadPDF (mesChants,sortedStructure)}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
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
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Partager les paroles sur WhatsApp
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-inner border border-gray-200">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-700" />
            Paroles
          </h2>

          <div className="space-y-6">
            {sortedStructure.map(({ _id, type, numero, contenu }) => (
              <div key={_id} className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border-l-4 border-blue-700 shadow-md hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent mb-3 capitalize">
                  {type} {numero}
                </h3>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed text-base">
                  {contenu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowDetailChant;
