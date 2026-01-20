import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Music, Video, Download, Share2, File } from "lucide-react";
import { formatDate } from "../utils/FormatDate";
import { handleDownloadPDF } from "../utils/HandleDownloadPDF";
import api from "../services/api";
import Header from "../components/Header";

function ShowDetailChant() {
  const Idchant = useParams().Idchant;
  const [mesChants, setMesChants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [user, setUser] = useState(null);
  const structure = mesChants ? mesChants.structure : [];
  const titre = mesChants ? mesChants.titre : "";
  // Utiliser l'ordre de saisie (ordre du tableau) au lieu de trier par numéro
  const sortedStructure = structure; // Conserver l'ordre original
  
  // Récupérer le rôle de l'utilisateur pour vérifier s'il est admin
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (err) {
        console.error("Erreur lors du parsing de l'utilisateur:", err);
      }
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const savedSize = localStorage.getItem("fontSize");
    if (savedSize) {
      setFontSize(parseInt(savedSize));
    }
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-yellow-50">
      <Header user={user} titre={mesChants?.titre || "Détails du chant"} />
      <div className="py-4 sm:py-8 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-white/20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent mb-4 sm:mb-6 break-words">
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

        <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
          <span>
            <span className="font-semibold">Créé le :</span> {formatDate(mesChants.date_creation) || "Non spécifié"}
          </span>
          <span>
            <span className="font-semibold">Mis à jour le :</span> {formatDate(mesChants.date_mise_a_jour) || "Non spécifié"}
            {user?.role === "admin" && mesChants.modifie_par?.nom && (
              <span className="ml-2 text-blue-700 font-semibold">par {mesChants.modifie_par.nom}</span>
            )}
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
                onClick={()=>handleDownloadPDF (mesChants, structure)}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger les paroles en PDF
              </button>
              <button
                onClick={() => {
                  const messageStructure = structure
                    .map(
                      ({ type, numero, contenu }) =>
                        `${type} ${numero}\n${contenu}`
                    )
                    .join("\n\n");

                  const message = `Voici les paroles du chant "${titre}" :\n\n${messageStructure}`;
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

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-inner border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent mb-4 sm:mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-700" />
            Paroles
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {structure.map((part, index) => {
              const { _id, type, numero, contenu } = part;
              return (
                <div key={_id || index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 border-l-4 border-blue-700 shadow-md hover:shadow-lg transition-all">
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent mb-2 sm:mb-3 capitalize">
                    {type} {numero}
                  </h3>
                  <p 
                    className="whitespace-pre-line text-gray-700 leading-relaxed break-words"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {contenu}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ShowDetailChant;
