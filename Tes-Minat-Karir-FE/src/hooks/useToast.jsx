import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

function Toast({ message, type }) {
  const styles = {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 9999,
    padding: "12px 20px",
    borderRadius: 12,
    fontFamily: "var(--font)",
    fontSize: 13,
    fontWeight: 600,
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    animation: "toastIn 0.25s ease",
    background:
      type === "success" ? "var(--success)"
      : type === "danger" ? "var(--danger)"
      : "#333",
  };

  const icon = type === "success" ? "✓" : type === "danger" ? "✕" : "ℹ";

  return (
    <>
      <style>{`@keyframes toastIn{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <div style={styles}>{icon} {message}</div>
    </>
  );
}
