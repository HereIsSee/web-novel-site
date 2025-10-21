import { createContext, useState, useCallback } from "react";
import Toast from "../components/Toast/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: "", type: "info" });

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "info" });
    }, duration);
  }, []);

  const hideToast = () => setToast({ message: "", type: "info" });

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

export { ToastContext };
