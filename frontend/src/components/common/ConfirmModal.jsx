import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmer l'action",
  message = "Êtes-vous sûr de vouloir continuer ?",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger", // danger, warning, info
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonVariant: "danger",
      accent: "bg-red-500",
    },
    warning: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      buttonVariant: "secondary",
      accent: "bg-amber-500",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonVariant: "primary",
      accent: "bg-blue-700",
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        {/* Icône et message */}
        <div className="flex items-start gap-4">
          <div className={`${style.iconBg} rounded-full p-3 flex-shrink-0`}>
            <AlertTriangle className={`w-6 h-6 ${style.iconColor}`} strokeWidth={2.5} />
          </div>
          <p className="text-gray-700 text-base leading-relaxed pt-1">{message}</p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 sm:flex-initial"
          >
            {cancelText}
          </Button>
          <Button
            variant={style.buttonVariant}
            onClick={handleConfirm}
            className="flex-1 sm:flex-initial"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
