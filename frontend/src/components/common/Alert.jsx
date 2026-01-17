import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Alert({ message, type = "info", onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: "bg-gradient-to-r from-emerald-50 to-green-50",
      border: "border-emerald-300",
      text: "text-emerald-900",
      iconBg: "bg-emerald-500",
      iconColor: "text-white",
      icon: CheckCircle,
      shadow: "shadow-emerald-500/20",
      accent: "bg-emerald-500",
    },
    error: {
      bg: "bg-gradient-to-r from-red-50 to-rose-50",
      border: "border-red-300",
      text: "text-red-900",
      iconBg: "bg-red-500",
      iconColor: "text-white",
      icon: AlertCircle,
      shadow: "shadow-red-500/20",
      accent: "bg-red-500",
    },
    danger: {
      bg: "bg-gradient-to-r from-red-50 to-rose-50",
      border: "border-red-300",
      text: "text-red-900",
      iconBg: "bg-red-500",
      iconColor: "text-white",
      icon: AlertCircle,
      shadow: "shadow-red-500/20",
      accent: "bg-red-500",
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-50 to-orange-50",
      border: "border-amber-300",
      text: "text-amber-900",
      iconBg: "bg-amber-500",
      iconColor: "text-white",
      icon: AlertTriangle,
      shadow: "shadow-amber-500/20",
      accent: "bg-amber-500",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
      border: "border-blue-300",
      text: "text-blue-900",
      iconBg: "bg-blue-700",
      iconColor: "text-white",
      icon: Info,
      shadow: "shadow-blue-500/20",
      accent: "bg-blue-700",
    },
  };

  // Mapper "danger" vers "error" si nécessaire
  const normalizedType = type === "danger" ? "error" : type;
  const style = styles[normalizedType] || styles.info;
  const Icon = style.icon;

  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[120] ${style.bg} ${style.border} border-2 rounded-2xl shadow-2xl ${style.shadow} w-[calc(100vw-2rem)] max-w-[420px] sm:max-w-[480px] overflow-hidden animate-scaleIn backdrop-blur-sm`}
      role="alert"
      aria-live="assertive"
    >
      {/* Barre d'accent colorée en haut */}
      <div className={`h-1 ${style.accent}`} aria-hidden="true" />
      
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Icône dans un cercle coloré */}
          <div className={`${style.iconBg} rounded-full p-2.5 flex-shrink-0 shadow-lg`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${style.iconColor}`} strokeWidth={2.5} />
          </div>
          
          {/* Message */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className={`${style.text} text-sm sm:text-base font-semibold leading-relaxed`}>
              {message}
            </p>
          </div>
          
          {/* Bouton fermer */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`flex-shrink-0 p-1.5 rounded-lg ${style.text} hover:bg-white/50 active:bg-white/70 transition-all duration-200 min-w-[32px] min-h-[32px] flex items-center justify-center`}
              aria-label="Fermer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
