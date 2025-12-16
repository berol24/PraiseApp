import React, { useState, useEffect } from "react";
import { setToastHandler } from "../services/toast";

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setToastHandler((message, type = "info") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    });
    return () => setToastHandler(null);
  }, []);

  return (
    <>
      {children}
      {toast && (
        <div className={`fixed right-4 bottom-6 z-50 p-4 rounded shadow-lg bg-white border `}>
          <div className="font-semibold">{toast.type}</div>
          <div className="mt-1">{toast.message}</div>
        </div>
      )}
    </>
  );
}
