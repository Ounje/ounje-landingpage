import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, CheckCircle, AlertCircle, ShoppingBag, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  title: string;
  body: string;
  type: string;
  relatedId?: string;
}

export const triggerToast = (message: Omit<ToastMessage, "id"> & { id?: string }) => {
  const id = message.id || `toast-${Date.now()}`;
  const event = new CustomEvent("ounje_new_toast", {
    detail: { ...message, id },
  });
  window.dispatchEvent(event);
};

export default function NotificationToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleNewToast = (e: Event) => {
      const toast = (e as CustomEvent).detail as ToastMessage;
      setToasts((prev) => [...prev, toast]);
      
      // Auto-dismiss after 6 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 6000);
    };

    window.addEventListener("ounje_new_toast", handleNewToast);
    return () => window.removeEventListener("ounje_new_toast", handleNewToast);
  }, []);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "order_update":
      case "order_status":
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case "new_order":
        return <CheckCircle className="w-5 h-5 text-indigo-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "time_sensitive":
        return <Clock className="w-5 h-5 text-rose-500" />;
      default:
        return <Bell className="w-5 h-5 text-[#2C5E2E]" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "order_update":
      case "order_status":
        return "bg-emerald-50/90 border-emerald-200 border-l-emerald-500";
      case "new_order":
        return "bg-indigo-50/90 border-indigo-200 border-l-indigo-500";
      case "alert":
        return "bg-amber-50/90 border-amber-200 border-l-amber-500";
      case "time_sensitive":
        return "bg-rose-50/90 border-rose-200 border-l-rose-500";
      default:
        return "bg-[#ECFFED]/90 border-[#2C5E2E]/10 border-l-[#2C5E2E]";
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 100, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 120, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex gap-3 p-4 bg-white/95 backdrop-blur-md border rounded-2xl shadow-xl border-l-4 ${getBgColor(
              toast.type
            )}`}
          >
            <div className="shrink-0 mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-extrabold text-[#1A3F1C] leading-snug">{toast.title}</h5>
              <p className="text-xs text-gray-500 mt-1 font-semibold leading-relaxed">{toast.body}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="shrink-0 text-gray-400 hover:text-gray-600 rounded-lg p-0.5 hover:bg-gray-50 self-start"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
