import { createContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { API_BASE_URL } from "../api/client";
import { toWebSocketUrl } from "../utils/network";
import type { LiveAlert, SocketState } from "../types/websocket";

const WS_PREFIX = "/api/v1/ws";

interface WebSocketContextValue {
  socketState: SocketState;
  alerts: LiveAlert[];
  connect: (userId: number | string) => void;
  disconnect: () => void;
  clearAlerts: () => void;
}

export const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<WebSocket | null>(null);

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

  const connect = (userId: number | string) => {
    if (!userId && userId !== 0) return;

    disconnect();

    const wsUrl = toWebSocketUrl(API_BASE_URL, `${WS_PREFIX}/${userId}`);
    const socket = new WebSocket(wsUrl);

    socketRef.current = socket;
    setSocketState("connecting");

    socket.onopen = () => {
      setSocketState("connected");
      pushAlert({
        title: "WebSocket connected",
        message: `Connected to alerts stream as user ${userId}.`,
        severity: "info",
        time: new Date().toLocaleTimeString(),
      });
    };

    socket.onmessage = (event) => {
      let parsed: unknown = event.data;

      try {
        parsed = JSON.parse(event.data);
      } catch {
        // keep raw string
      }

      if (parsed && typeof parsed === "object") {
        const payload = parsed as Record<string, unknown>;

        pushAlert({
          title: typeof payload.title === "string" ? payload.title : "Live alert",
          message:
            typeof payload.message === "string"
              ? payload.message
              : JSON.stringify(payload, null, 2),
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
    };

    socket.onclose = () => {
      setSocketState("disconnected");
    };
  };

  const clearAlerts = () => setAlerts([]);

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