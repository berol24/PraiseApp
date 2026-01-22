import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FileText, Music, Video, Download, Share2, File, Star, Copy, MessageSquare, Mail, Users, Hash, Smartphone } from "lucide-react";
import { formatDate } from "../utils/FormatDate";
import { handleDownloadPDF } from "../utils/HandleDownloadPDF";
import api from "../services/api";
import Header from "../components/Header";
import Modal from "../components/common/Modal";
import { toast } from "../services/toast";

function getYoutubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return m ? m[1] : null;
}

function ShowDetailChant() {
  const { Idchant } = useParams();
  const [mesChants, setMesChants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [user, setUser] = useState(null);
  const [favoris, setFavoris] = useState([]);
  const [similarChants, setSimilarChants] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMode, setShareMode] = useState("lien"); // "lien" | "paroles"
  const structure = mesChants ? mesChants.structure : [];
  const titre = mesChants ? mesChants.titre : "";
  const youtubeId = mesChants?.fichiers?.video_youtube ? getYoutubeId(mesChants.fichiers.video_youtube) : null;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Erreur lors du parsing de l'utilisateur:", err);
      }
    }
  }, []);

  useEffect(() => {
    const savedSize = localStorage.getItem("fontSize");
    if (savedSize) setFontSize(parseInt(savedSize));
  }, []);

  const fetchFavoris = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get("/api/chants/favoris");
      setFavoris(res.data || []);
    } catch (err) {
      console.error("Erreur chargement favoris:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchFavoris();
  }, [fetchFavoris]);

  useEffect(() => {
    if (!Idchant) return;
    setLoading(true);
    api.get(`/api/chants/${Idchant}`)
      .then((res) => {
        setMesChants(res.data);
      })
      .catch((err) => console.error("Erreur chargement chant:", err))
      .finally(() => setLoading(false));
  }, [Idchant]);

  useEffect(() => {
    if (!Idchant) return;
    api.get(`/api/chants/${Idchant}/similar`)
      .then((res) => setSimilarChants(res.data || []))
      .catch(() => setSimilarChants([]));
  }, [Idchant]);

  const isFavori = (chantId) => favoris.some((f) => f._id === chantId);

  const handleFavori = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await api.post(`/api/chants/favoris/${Idchant}`);
      fetchFavoris();
    } catch (err) {
      console.error("Erreur favoris:", err);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Découvrez le chant "${titre}" sur PraiseApp`;
  const parolesText = (structure || []).map(({ type, numero, contenu }) => `${type} ${numero}\n${contenu || ""}`).join("\n\n");
  const parolesFull = `Paroles du chant "${titre}"\n\n${parolesText}\n\n${shareUrl}`;

  const handleCopyLink = async () => {
    const toCopy = shareMode === "paroles" ? parolesFull : shareUrl;
    const msg = shareMode === "paroles" ? "Paroles copiées dans le presse-papier" : "Lien copié dans le presse-papier";
    try {
      await navigator.clipboard.writeText(toCopy);
      toast(msg, "success");
      setShowShareModal(false);
    } catch {
      toast("Erreur lors de la copie", "error");
    }
  };

  const handleShareToWhatsApp = () => {
    const txt = shareMode === "paroles" ? parolesFull : shareText + " " + shareUrl;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, "_blank");
    setShowShareModal(false);
  };
  const handleShareToSMS = () => {
    const txt = shareMode === "paroles" ? parolesFull : shareText + " " + shareUrl;
    window.open(`sms:?body=${encodeURIComponent(txt)}`, "_blank");
    setShowShareModal(false);
  };
  const handleShareToEmail = () => {
    const subject = shareMode === "paroles" ? "Paroles: " + titre : "Chant: " + titre;
    const body = shareMode === "paroles" ? parolesFull : shareText + "\n" + shareUrl;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    setShowShareModal(false);
  };
  const handleShareToFacebook = () => {
    const q = shareMode === "paroles" ? "&quote=" + encodeURIComponent("Paroles du chant \"" + titre + "\"") : "";
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}${q}`, "_blank");
    setShowShareModal(false);
  };
  const handleShareToTwitter = () => {
    const text = shareMode === "paroles" ? `Paroles du chant "${titre}"` : shareText;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
    setShowShareModal(false);
  };
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        const title = shareMode === "paroles" ? "Paroles - " + titre : titre;
        const text = shareMode === "paroles" ? parolesFull : shareText;
        await navigator.share({ title, text, url: shareUrl });
        setShowShareModal(false);
      } catch (err) {
        if (err.name !== "AbortError") toast("Erreur lors du partage", "error");
      }
    }
  };

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
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent break-words flex-1 min-w-0">
            {mesChants.titre || "Pas de titre"}
          </h1>
          {user && (
            <button
              onClick={handleFavori}
              className={`text-3xl transition-all transform hover:scale-110 flex-shrink-0 ${
                isFavori(Idchant) ? "text-amber-500 hover:text-amber-600" : "text-gray-300 hover:text-amber-400"
              }`}
              title={isFavori(Idchant) ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              {isFavori(Idchant) ? "★" : "☆"}
            </button>
          )}
        </div>

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
                <button
                    onClick={() =>
                      window.open(mesChants.fichiers.partition_pdf, "_blank")
                    }
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Partition PDF
                  </button>
              </div>
            )}

            {/* AUDIO MP3 - Lecteur intégré */}
            {mesChants.fichiers?.audio_mp3 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  Écouter
                </p>
                <audio
                  controls
                  className="w-full h-10"
                  src={mesChants.fichiers.audio_mp3}
                >
                  Votre navigateur ne supporte pas l'audio.
                </audio>
                <a
                    href={mesChants.fichiers.audio_mp3}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Ouvrir dans un nouvel onglet
                  </a>
              </div>
            )}

            {/* VIDÉO YOUTUBE - Intégration */}
            {mesChants.fichiers?.video_youtube && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Vidéo YouTube
                </p>
                {youtubeId ? (
                  <div className="aspect-video w-full max-w-2xl rounded-xl overflow-hidden bg-black">
                    <iframe
                      title={`Vidéo ${titre}`}
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a
                    href={mesChants.fichiers.video_youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Voir la vidéo
                  </a>
                )}
              </div>
            )}

            {/* BOUTONS GLOBAUX */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <button
                onClick={() => handleDownloadPDF(mesChants, structure)}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger les paroles en PDF
              </button>
              <button
                onClick={() => { setShareMode("lien"); setShowShareModal(true); }}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Partager le lien
              </button>
              <button
                onClick={() => { setShareMode("paroles"); setShowShareModal(true); }}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Partager les paroles
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-inner border border-gray-200 relative">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent flex items-center gap-2 mb-4 sm:mb-6">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-700" />
            Paroles
          </h2>

          <div className="space-y-4 sm:space-y-6" id="paroles-content">
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

        {/* Chants similaires */}
        {similarChants.length > 0 && (
          <div className="mt-8 p-4 sm:p-6 bg-white/90 rounded-2xl shadow-lg border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Chants similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarChants.map((c) => (
                <Link
                  to={`/showChants/${c._id}`}
                  key={c._id}
                  className="block p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-gray-800 line-clamp-2">{c.titre}</p>
                  <p className="text-sm text-gray-500 italic">{c.auteur || "Inconnu"}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Modal partage du chant */}
        <Modal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={shareMode === "paroles" ? "Partager les paroles" : "Partager le lien"}
          size="md"
        >
          <div className="space-y-4 sm:space-y-6 pb-2">
            <p className="text-sm sm:text-base text-gray-600 text-center mb-4 px-2">
              {shareMode === "paroles" ? "Choisissez une application pour partager les paroles" : "Choisissez une application pour partager le lien"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={handleShareToWhatsApp}
                className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-xl border border-emerald-200 transition-all shadow-md hover:shadow-lg min-h-[100px] sm:min-h-[120px]"
              >
                <div className="p-2.5 sm:p-3 bg-emerald-500 rounded-full">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">WhatsApp</span>
              </button>
              <button
                onClick={handleShareToSMS}
                className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border border-blue-200 transition-all shadow-md hover:shadow-lg min-h-[100px] sm:min-h-[120px]"
              >
                <div className="p-2.5 sm:p-3 bg-blue-500 rounded-full">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">SMS</span>
              </button>
              <button
                onClick={handleShareToEmail}
                className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl border border-gray-200 transition-all shadow-md hover:shadow-lg min-h-[100px] sm:min-h-[120px]"
              >
                <div className="p-2.5 sm:p-3 bg-gray-600 rounded-full">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">Email</span>
              </button>
              <button
                onClick={handleShareToFacebook}
                className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-xl border border-blue-200 transition-all shadow-md hover:shadow-lg min-h-[100px] sm:min-h-[120px]"
              >
                <div className="p-2.5 sm:p-3 bg-blue-600 rounded-full">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">Facebook</span>
              </button>
              <button
                onClick={handleShareToTwitter}
                className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-sky-50 to-cyan-100 hover:from-sky-100 hover:to-cyan-200 rounded-xl border border-sky-200 transition-all shadow-md hover:shadow-lg min-h-[100px] sm:min-h-[120px]"
              >
                <div className="p-2.5 sm:p-3 bg-sky-500 rounded-full">
                  <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">Twitter/X</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl border border-purple-200 transition-all shadow-md hover:shadow-lg min-h-[100px] sm:min-h-[120px]"
              >
                <div className="p-2.5 sm:p-3 bg-purple-500 rounded-full">
                  <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">Copier</span>
              </button>
            </div>
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              {navigator.share ? (
                <>
                  <p className="text-xs sm:text-sm text-gray-500 text-center mb-3 sm:mb-4 px-2">
                    💡 Utilisez le partage natif pour voir toutes les applications installées sur votre appareil
                  </p>
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <Share2 className="w-5 h-5 flex-shrink-0" />
                    Partager via toutes les applications
                  </button>
                </>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500 text-center px-2 leading-relaxed">
                  ℹ️ Partager via toutes les applications (partage natif) n'est pas disponible sur cet appareil ou navigateur. Utilisez les options ci-dessus (WhatsApp, SMS, Email, etc.).
                </p>
              )}
            </div>
          </div>
        </Modal>
        </div>
      </div>
    </div>
  );
}

export default ShowDetailChant;
