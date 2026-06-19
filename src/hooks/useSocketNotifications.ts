import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import { useNotificationStore } from "./useNotificationStore";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://ounje-mobile-backend.pxxl.pro").replace(/\/$/, "");

export const useSocketNotifications = (addToast?: (notif: any) => void) => {
  const { token, isAuthenticated, role, user } = useAuthStore();
  const { addNotification, setSocketConnected, fetchNotifications } = useNotificationStore();
  const socketRef = useRef<Socket | null>(null);
  const pollingRef = useRef<any>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      setSocketConnected(false);
      return;
    }

    // Load initial notification history
    fetchNotifications();

    // Initialize socket client connection
    const socket = io(BASE_URL, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Notification socket connected successfully.");
      setSocketConnected(true);
      
      // Stop fallback HTTP polling when socket is active
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    });

    socket.on("disconnect", () => {
      console.log("Notification socket disconnected.");
      setSocketConnected(false);
      startFallbackPolling();
    });

    socket.on("connect_error", (err) => {
      console.error("Notification socket connection error:", err);
      setSocketConnected(false);
      startFallbackPolling();
    });

    socket.on("notification", (data: any) => {
      console.log("Real-time notification received:", data);
      
      const newNotif = {
        id: data.id || data._id || `notif-${Date.now()}`,
        title: data.title || "New Alert",
        body: data.body || data.message || "",
        type: data.type || "general",
        relatedId: data.relatedId || data.orderId || data.vendorId,
        createdAt: data.createdAt || new Date().toISOString(),
      };

      // Insert into local Zustand store
      addNotification(newNotif);

      // Trigger user-facing toast
      if (addToast) {
        addToast(newNotif);
      }

      // Dispatch custom DOM event to trigger relative UI dashboard updates
      const event = new CustomEvent("ounje_notification", { detail: { type: newNotif.type } });
      window.dispatchEvent(event);
    });

    const startFallbackPolling = () => {
      if (pollingRef.current) return;
      console.log("WebSocket offline: Starting notification HTTP polling fallback...");
      pollingRef.current = setInterval(() => {
        fetchNotifications();
      }, 15000);
    };

    return () => {
      socket.disconnect();
      socketRef.current = null;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      setSocketConnected(false);
    };
  }, [isAuthenticated, token, role, user?.id]);

  return {
    socket: socketRef.current,
  };
};
