import { createContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { API_BASE_URL } from "../api/client";
import { toWebSocketUrl } from "../utils/network";
import type { LiveAlert, SocketState } from "../types/websocket";
import { useAuth } from "../hooks/useAuth";

const WS_PREFIX = "/api/v1/ws";

interface WebSocketContextValue {
  socketState: SocketState;
  alerts: LiveAlert[];
  connect: () => void;
  disconnect: () => void;
  clearAlerts: () => void;
}

export const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();
  const userRef = useRef(user);
  const [socketState, setSocketState] = useState<SocketState>("disconnected");
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);

  const pushAlert = (alert: Omit<LiveAlert, "id">) => {
    setAlerts((prev) => [
      {
        id: crypto.randomUUID(),
        ...alert,
      },
      ...prev,
    ].slice(0, 20));
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setSocketState("disconnected");
  };

  const connect = () => {
    if (!userRef.current?.id) {
      pushAlert({
        title: "Not ready",
        message: "User information is not loaded yet. Please try again in a moment.",
        severity: "warning",
        time: new Date().toLocaleTimeString(),
      });
      return;
    }

    disconnect();
    setSocketState("connecting");

    if (!navigator.geolocation) {
      setSocketState("error");
      pushAlert({
        title: "Location unavailable",
        message: "Your browser does not support geolocation.",
        severity: "warning",
        time: new Date().toLocaleTimeString(),
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // user may have logged out while location was loading
        if (!userRef.current || !userRef.current.id) {
          setSocketState("disconnected");

          pushAlert({
            title: "Connection cancelled",
            message: "You are no longer authenticated.",
            severity: "warning",
            time: new Date().toLocaleTimeString(),
          });

          return;
        }

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const wsUrl = toWebSocketUrl(
          API_BASE_URL,
          `${WS_PREFIX}/${userRef.current.id}`
        );
        const url = new URL(wsUrl);
        url.searchParams.set("lat", String(lat));
        url.searchParams.set("lng", String(lng));

        const socket = new WebSocket(url.toString());
        socketRef.current = socket;

        socket.onopen = () => {
          setSocketState("connected");
          pushAlert({
            title: "WebSocket connected",
            message: "Connected with location enabled.",
            severity: "info",
            time: new Date().toLocaleTimeString(),
          });
        };

        socket.onmessage = (event) => {
          let parsed: unknown = event.data;

          try {
            parsed = JSON.parse(event.data);
          } catch {}

          if (parsed && typeof parsed === "object") {
            const payload = parsed as Record<string, unknown>;

            pushAlert({
              title: typeof payload.title === "string" ? payload.title : "Live alert",
              message:
                typeof payload.message === "string"
                  ? payload.message
                  : undefined,
              severity: typeof payload.severity === "string" ? payload.severity : "info",
              time: new Date().toLocaleTimeString(),
              raw: payload,
            });
            return;
          }

          pushAlert({
            title: "Live alert",
            message: String(parsed),
            severity: "info",
            time: new Date().toLocaleTimeString(),
            raw: parsed,
          });
        };

        socket.onerror = () => {
          setSocketState("error");
          pushAlert({
            title: "Connection error",
            message: "WebSocket failed to connect.",
            severity: "error",
            time: new Date().toLocaleTimeString(),
          });
        };

        socket.onclose = () => {
          setSocketState("disconnected");
        };
      },
      (error) => {
        setSocketState("error");

        pushAlert({
          title: "Location required",
          message:
            error.code === error.PERMISSION_DENIED
              ? "Please allow location access to connect."
              : error.code === error.TIMEOUT
                ? "Getting your location took too long. Try again."
                : "Unable to get your location.",
          severity: "warning",
          time: new Date().toLocaleTimeString(),
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 4000,
        maximumAge: 60000,
      }
    );
  };


  const clearAlerts = () => setAlerts([]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!user) {
      disconnect();
      clearAlerts();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const value = useMemo<WebSocketContextValue>(
    () => ({
      socketState,
      alerts,
      connect,
      disconnect,
      clearAlerts,
    }),
    [socketState, alerts]
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}