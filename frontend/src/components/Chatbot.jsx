import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";

const SUGGESTIONS = [
  "Comment s'inscrire ?",
  "Comment se connecter ?",
  "Comment rechercher un chant ?",
  "Comment partager un chant ?",
  "Où sont mes favoris ?",
  "C'est quoi PraiseApp ?",
  "Comment ajouter un chant ?",
];

const REPONSES = [
  {
    keywords: ["bonjour", "salut", "hello", "coucou", "hey", "bonsoir"],
    answer: "Bonjour ! 👋 Je suis l'assistant PraiseApp. Posez-moi une question sur la recherche, les filtres, les favoris, le partage ou l'ajout de chants.",
  },
  {
    keywords: ["c'est quoi", "qu'est-ce", "praiseapp", "application"],
    answer: "**PraiseApp** est une application pour découvrir et gérer des chants de louange et d'adoration. Vous pouvez parcourir les chants, lire les paroles, écouter les enregistrements, regarder les vidéos YouTube, les partager, les télécharger en PDF et les mettre en favoris.",
  },
  {
    keywords: ["comment ça marche", "comment ca marche", "utiliser", "fonctionnement"],
    answer: "Pour utiliser PraiseApp : 1) Parcourez les chants sur la page d'accueil ou « Mon espace » si vous êtes connecté. 2) Utilisez la **recherche** et les **filtres** (catégorie, langue, rythme) pour affiner. 3) Cliquez sur un chant pour voir les paroles, l'audio, la vidéo. 4) Partagez ou téléchargez le PDF. 5) Connectez-vous pour ajouter des chants et gérer vos favoris.",
  },
  {
    keywords: ["s'inscrire", "inscrire", "inscription", "créer un compte", "créer compte", "register", "m'inscrire"],
    answer: "Pour **s'inscrire** : allez sur la page **Inscription** (/register ou lien « S'inscrire » sur la page Connexion). Renseignez votre **nom**, votre **email** et un **mot de passe**, puis validez. Après l'inscription, vous serez redirigé vers la page de connexion pour vous connecter.",
  },
  {
    keywords: ["se connecter", "connecter", "connexion", "me connecter", "login", "identifier"],
    answer: "Pour **se connecter** : allez sur la page **Connexion** (/login ou lien « Connexion » dans le menu). Entrez votre **email** et votre **mot de passe**, puis cliquez sur « Se connecter ». Une fois connecté, vous accédez à Mon espace, aux Favoris et vous pouvez ajouter des chants. En cas de **mot de passe oublié**, utilisez le lien « Mot de passe oublié ? » sur la page Connexion.",
  },
  {
    keywords: ["déconnexion", "se déconnecter", "déconnecter", "logout", "deconnexion", "deconnecter"],
    answer: "Pour **se déconnecter** : dans le **menu** (en haut à droite quand vous êtes connecté), cliquez sur **« Déconnexion »**. Vous serez redirigé vers la page de connexion.",
  },
  {
    keywords: ["mot de passe oublié", "oublié", "forgot", "réinitialiser mot de passe", "reset password", "changer mot de passe"],
    answer: "Pour **réinitialiser votre mot de passe** : sur la page **Connexion** (/login), cliquez sur le lien **« Mot de passe oublié ? »** (ou allez sur /forgot-password). Entrez votre **email** et votre **nouveau mot de passe** (avec confirmation), puis validez. Vous pourrez ensuite vous connecter avec le nouveau mot de passe.",
  },
  {
    keywords: ["rechercher", "chercher", "recherche", "trouver un chant"],
    answer: "Pour **rechercher un chant** : utilisez la barre de recherche en haut (titre, auteur…). Vous pouvez aussi ouvrir le panneau **Filtres** (bouton « Filtres ») et choisir une **catégorie**, une **langue** ou un **rythme** pour afficher uniquement les chants correspondants.",
  },
  {
    keywords: ["filtre", "filtres", "catégorie", "langue", "rythme"],
    answer: "Les **filtres** permettent d'affiner la liste des chants. Cliquez sur le bouton « Filtres » pour ouvrir le panneau. Vous pouvez sélectionner des **catégories** (ex. Adoration, Louange), une **langue** (ex. Français, Anglais) et un **rythme** (ex. Zouk). Cliquez sur « Réinitialiser » pour tout effacer.",
  },
  {
    keywords: ["favori", "favoris", "étoile", "etoile"],
    answer: "Pour **ajouter un chant aux favoris** : connectez-vous, puis cliquez sur l'étoile ☆ sur la carte du chant ou sur sa page. Pour **voir vos favoris** : dans le menu, cliquez sur « Favoris » (ou allez sur /favoris). Vous devez être connecté pour utiliser cette fonction.",
  },
  {
    keywords: ["partager", "partage", "partager un chant", "partager les paroles"],
    answer: "Sur la page d'un chant, vous avez deux boutons : **« Partager le lien »** (lien vers la page) et **« Partager les paroles »** (texte des paroles). Chacun ouvre un menu avec WhatsApp, SMS, Email, Facebook, Twitter, Copier le lien et **« Partager via toutes les applications »** (partage natif sur mobile).",
  },
  {
    keywords: ["ajouter un chant", "ajouter", "créer un chant", "nouveau chant"],
    answer: "Pour **ajouter un chant** : connectez-vous, allez dans **« Mon espace »** (page d'accueil quand vous êtes connecté) et cliquez sur **« Ajouter un chant »**. Renseignez le titre, l'auteur, la structure (couplets, refrains), la langue, le rythme, les catégories et les fichiers (PDF, audio, vidéo YouTube) si vous en avez.",
  },
  {
    keywords: ["modifier", "éditer", "editer", "supprimer", "supprimer un chant"],
    answer: "Dans **« Mon espace »**, sur chaque carte de chant vous avez : **« Éditer »** pour modifier le chant, et **« Supprimer »** pour le retirer. Seuls vos propres chants (ou ceux que vous avez le droit de gérer) affichent ces boutons.",
  },
  {
    keywords: ["pdf", "télécharger", "telecharger", "paroles en pdf"],
    answer: "Pour **télécharger les paroles en PDF** : ouvrez un chant, puis cliquez sur le bouton **« Télécharger les paroles en PDF »** dans la section Fichiers. Le PDF contient le titre, l'auteur, les infos et les paroles avec le logo PraiseApp.",
  },
  {
    keywords: ["vidéo", "video", "youtube", "audio", "écouter", "ecouter"],
    answer: "Sur la page d'un chant, vous trouverez : la **vidéo YouTube** (intégrée si un lien est fourni), l'**audio** (lecteur intégré si un fichier MP3 est fourni) et un lien vers la **partition PDF** si disponible. Tout est dans la section « Fichiers ».",
  },
  {
    keywords: ["où", "ou est", "où est", "page favoris", "mon espace", "favoris"],
    answer: "**Favoris** : dans le menu (header), cliquez sur « Favoris » — ou allez sur /favoris. **Mon espace** : c'est la page d'accueil quand vous êtes connecté ; vous y voyez vos chants et le bouton « Ajouter un chant ».",
  },
  {
    keywords: ["merci", "ok", "d'accord", "parfait", "super"],
    answer: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. 😊",
  },
];

function getReponse(texte) {
  const t = (texte || "").toLowerCase().trim();
  if (!t) return null;
  for (const r of REPONSES) {
    if (r.keywords.some((k) => t.includes(k))) return r.answer;
  }
  return null;
}

function formatMessage(str) {
  if (!str) return str;
  return str.split(/\*\*(.*?)\*\*/g).map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

export default function Chatbot() {
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState([]);
  const [saisie, setSaisie] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (ouvert) {
      inputRef.current?.focus();
      if (messages.length === 0) {
        setMessages([
          {
            role: "bot",
            text: "Bonjour ! 👋 Je suis l'assistant PraiseApp. Posez-moi une question sur la recherche, les filtres, les favoris, le partage ou l'ajout de chants.",
            suggestions: true,
          },
        ]);
      }
    }
  }, [ouvert]);

  const envoyer = (texte) => {
    const txt = (typeof texte === "string" ? texte : saisie).trim();
    if (!txt) return;

    setSaisie("");
    setEnvoi(true);

    const userMsg = { role: "user", text: txt };
    setMessages((m) => [...m, userMsg]);

    const rep = getReponse(txt);
    const botText = rep || "Je n'ai pas bien compris. Vous pouvez essayer une des questions ci‑dessous ou reformuler.";
    const botMsg = {
      role: "bot",
      text: botText,
      suggestions: !rep,
    };

    setTimeout(() => {
      setMessages((m) => [...m, botMsg]);
      setEnvoi(false);
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    envoyer(saisie);
  };

  return (
    <>
      {/* Bouton flottant */}
      {!ouvert && (
        <button
          onClick={() => setOuvert(true)}
          className="fixed bottom-6 right-6 z-[90] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-lg shadow-blue-700/40 hover:shadow-xl hover:shadow-blue-700/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-white"
          aria-label="Ouvrir l'assistant"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      )}

      {/* Panneau de chat */}
      {ouvert && (
        <div
          className="fixed bottom-4 right-4 z-[95] w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] sm:h-[560px] flex flex-col rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-white animate-in"
          style={{
            animation: "chatbotSlide 0.3s ease-out",
          }}
          role="dialog"
          aria-label="Assistant PraiseApp"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base sm:text-lg">Assistant PraiseApp</h2>
                <p className="text-xs text-blue-200">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setOuvert(false)}
              className="p-2 rounded-xl hover:bg-white/20 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/80 to-white">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{formatMessage(msg.text)}</p>
                </div>
              </div>
            ))}
            {envoi && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200/80 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.15s" }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (dernier message bot avec suggestions) */}
          {messages.length > 0 &&
            messages[messages.length - 1]?.role === "bot" &&
            messages[messages.length - 1]?.suggestions && (
              <div className="flex-shrink-0 px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => envoyer(s)}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Saisie */}
          <form
            onSubmit={handleSubmit}
            className="flex-shrink-0 p-3 border-t border-gray-200 bg-white"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={saisie}
                onChange={(e) => setSaisie(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-800 placeholder-gray-400 text-sm transition-all"
              />
              <button
                type="submit"
                disabled={!saisie.trim() || envoi}
                className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
                aria-label="Envoyer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @keyframes chatbotSlide {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-in { animation: chatbotSlide 0.3s ease-out; }
      `}</style>
    </>
  );
}
