import React, { useState, useEffect } from "react";
import { setToastHandler } from "../services/toast";
import Alert from "./common/Alert";

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setToastHandler((message, type = "info") => {
      setToast({ message, type });
    });
    return () => setToastHandler(null);
  }, []);

  return (
    <>
      {children}
      {toast && (
        <Alert
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </>
  );
}
