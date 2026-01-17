import { useState } from "react";
import { ChevronDown } from "lucide-react";

const LANGUAGES = [
  "Français", "Anglais", "Espagnol", "Allemand", "Italien", "Portugais",
  "Arabe", "Chinois", "Japonais", "Coréen", "Russe", "Hindi",
  "Néerlandais", "Grec", "Turc", "Polonais", "Suédois", "Norvégien",
  "Danois", "Finnois", "Tchèque", "Roumain", "Hongrois", "Bulgare",
  "Croate", "Serbe", "Slovaque", "Slovène", "Estonien", "Letton",
  "Lituanien", "Maltais", "Irlandais", "Gaélique", "Basque", "Catalan",
  "Galicien", "Ukrainien", "Biélorusse", "Géorgien", "Arménien", "Azéri",
  "Kazakh", "Ouzbek", "Mongol", "Thaï", "Vietnamien", "Indonésien",
  "Malais", "Tagalog", "Swahili", "Afrikaans", "Hébreu", "Persan",
  "Ourdou", "Bengali", "Tamoul", "Telugu", "Marathi", "Gujarati",
  "Punjabi", "Kannada", "Malayalam", "Odia", "Assamais", "Népalais",
  "Sinhala", "Birman", "Khmer", "Lao", "Cingalais", "Amharique",
  "Hausa", "Yoruba", "Igbo", "Zulu", "Xhosa"
];

export default function LanguageSelect({ value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");

  // Supprimer les doublons et filtrer
  const uniqueLanguages = [...new Set(LANGUAGES)];
  const filteredLanguages = uniqueLanguages.filter(lang =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (lang) => {
    onChange(lang);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (customLanguage.trim()) {
      onChange(customLanguage.trim());
      setIsOpen(false);
      setCustomLanguage("");
      setSearchTerm("");
    }
  };

  const handleCustomAdd = () => {
    if (customLanguage.trim()) {
      onChange(customLanguage.trim());
      setIsOpen(false);
      setCustomLanguage("");
      setSearchTerm("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all bg-white flex items-center justify-between"
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || "Sélectionner une langue"}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Rechercher une langue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
              autoFocus
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang, index) => (
                <button
                  key={`${lang}-${index}`}
                  type="button"
                  onClick={() => handleSelect(lang)}
                  className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                    value === lang ? "bg-blue-100 font-semibold" : ""
                  }`}
                >
                  {lang}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">
                Aucune langue trouvée
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ou saisir une langue..."
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCustomAdd();
                  }
                }}
                className="flex-1 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 text-sm"
              />
              <button
                type="button"
                onClick={handleCustomAdd}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
