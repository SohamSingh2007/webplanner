"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type, duration, visible: true }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    // Fully remove after exit animation (300ms)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  }, []);

  // Convenience helpers
  const toast = {
    success: (msg, dur) => addToast(msg, "success", dur),
    error:   (msg, dur) => addToast(msg, "error",   dur ?? 6000),
    warning: (msg, dur) => addToast(msg, "warning", dur),
    info:    (msg, dur) => addToast(msg, "info",    dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ── Single Toast ──────────────────────────────────────────────────────────────
const VARIANTS = {
  success: {
    icon: CheckCircle,
    bar:  "bg-emerald-500",
    bg:   "bg-white border-l-4 border-emerald-500",
    icon_cls: "text-emerald-500",
    title: "Success",
  },
  error: {
    icon: XCircle,
    bar:  "bg-red-500",
    bg:   "bg-white border-l-4 border-red-500",
    icon_cls: "text-red-500",
    title: "Error",
  },
  warning: {
    icon: AlertTriangle,
    bar:  "bg-amber-500",
    bg:   "bg-white border-l-4 border-amber-500",
    icon_cls: "text-amber-500",
    title: "Warning",
  },
  info: {
    icon: Info,
    bar:  "bg-blue-500",
    bg:   "bg-white border-l-4 border-blue-500",
    icon_cls: "text-blue-500",
    title: "Info",
  },
};

function Toast({ toast, onRemove }) {
  const [mounted, setMounted] = useState(false);
  const v = VARIANTS[toast.type] || VARIANTS.info;
  const Icon = v.icon;

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (!toast.duration) return;
    const t = setTimeout(() => onRemove(toast.id), toast.duration);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, onRemove]);

  const visible = toast.visible && mounted;

  return (
    <div
      role="alert"
      className={`
        relative flex items-start gap-3 w-full max-w-sm rounded-xl shadow-lg overflow-hidden
        ${v.bg} px-4 py-3.5
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${v.icon_cls}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold uppercase tracking-wide ${v.icon_cls}`}>{v.title}</p>
        <p className="text-sm text-stone-700 mt-0.5 leading-snug">{toast.message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-0.5 rounded text-stone-400 hover:text-stone-700 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      {toast.duration && (
        <ProgressBar duration={toast.duration} color={v.bar} />
      )}
    </div>
  );
}

function ProgressBar({ duration, color }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-100">
      <div
        className={`h-full ${color} origin-left`}
        style={{
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />
      <style jsx>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}

// ── Container ─────────────────────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto w-full max-w-sm">
          <Toast toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
