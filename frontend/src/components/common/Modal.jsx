import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children, title, size = "md" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px"; // éviter le saut de scrollbar
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
    full: "sm:max-w-full",
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal — style bottom-sheet sur mobile, centré sur desktop */}
      <div
        className={`relative w-full max-w-full ${sizeClasses[size]} max-h-[90dvh] sm:max-h-[85vh] flex flex-col animate-slideUpFromBottom sm:animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <div className="bg-white rounded-t-3xl rounded-b-none sm:rounded-2xl shadow-2xl border-t sm:border border-gray-200/50 overflow-hidden flex flex-col flex-1 min-h-0">
          {/* Poignée (mobile) */}
          <div className="sm:hidden flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300" aria-hidden="true" />
          </div>

          {/* Header */}
          {title && (
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-yellow-50 flex-shrink-0">
              <div className="flex items-center justify-between gap-3">
                <h2 id="modal-title" className="text-lg sm:text-2xl font-bold text-gray-800 truncate pr-2">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-shrink-0 p-2.5 sm:p-2 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-xl sm:rounded-lg hover:bg-gray-200/60 active:bg-gray-300/60 transition-colors text-gray-600 hover:text-gray-800"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Content — scroll interne sur mobile */}
          <div className="p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom,0px))] overflow-y-auto overflow-x-hidden flex-1 min-h-0 overscroll-contain">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
