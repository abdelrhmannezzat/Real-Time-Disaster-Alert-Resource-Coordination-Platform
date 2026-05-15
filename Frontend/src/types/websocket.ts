export type SocketState = "disconnected" | "connecting" | "connected" | "error";

export interface LiveAlert {
  id: string;

  title: string;
  message?: string;

  severity?: string;
  time: string;

  latitude?: number;
  longitude?: number;

  distance?: number;

  raw?: unknown;
}