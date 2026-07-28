import { useState, useEffect, useCallback } from "react";

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

let toastListeners: ((msg: ToastMessage) => void)[] = [];

export const showToast = (
  message: string,
  variant: ToastVariant = "info"
) => {
  const id = Date.now().toString() + Math.random().toString(36).slice(2);
  toastListeners.forEach((listener) => listener({ id, message, variant }));
};

export const Toast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((msg: ToastMessage) => {
    setToasts((prev) => [...prev, msg]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== msg.id));
    }, 4000);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== addToast);
    };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const variantStyles: Record<ToastVariant, { bg: string; icon: string }> = {
    success: { bg: "#059669", icon: "✓" },
    error: { bg: "#DC2626", icon: "✕" },
    info: { bg: "#2563EB", icon: "ℹ" },
    warning: { bg: "#D97706", icon: "⚠" },
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 380,
        width: "100%",
      }}
    >
      {toasts.map((toast) => {
        const style = variantStyles[toast.variant];
        return (
          <div
            key={toast.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 18px",
              background: style.bg,
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              color: "white",
              fontSize: 14,
              fontWeight: 500,
              animation: "slideInRight 0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => removeToast(toast.id)}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {style.icon}
            </span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                fontSize: 16,
                padding: 0,
                lineHeight: 1,
              }}
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};