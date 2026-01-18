import React, { useEffect } from "react";
import { createPortal } from "react-dom";
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
  // Render via portal to avoid being clipped by parent stacking contexts
  return createPortal(
    (
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fadeIn"
        onClick={onClose}
        style={{ zIndex: 110 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal — centré verticalement et horizontalement, with safe sizing for mobile */}
        <div
          className={`relative w-full max-w-[96vw] ${sizeClasses[size]} flex flex-col animate-scaleIn mx-auto`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          style={{
            maxHeight: '90vh',
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden flex flex-col" style={{ maxHeight: '100%' }}>

            {/* Header */}
            {title && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-yellow-50 flex-shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <h2 id="modal-title" className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex-1 pr-2 break-words">
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

            {/* Content — scroll interne */}
            <div 
              className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden overscroll-contain"
              style={{ 
                maxHeight: title 
                  ? 'calc(90vh - 120px)' 
                  : 'calc(90vh - 60px)',
                minHeight: '150px',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
}
