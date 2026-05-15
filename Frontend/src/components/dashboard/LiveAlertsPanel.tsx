import { Bell, Link2, Unlink2, Trash2 } from "lucide-react";

import type {
  LiveAlert,
  SocketState,
} from "../../types/websocket";

import {
  socketStateBadgeClass,
  severityBadgeClass,
} from "../../utils/format";

import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";

import { cx } from "../../utils/classNames";

interface LiveAlertsPanelProps {
  socketState: SocketState;
  alerts: LiveAlert[];

  onConnect: () => void;
  onDisconnect: () => void;
  onClear: () => void;
}

export default function LiveAlertsPanel({
  socketState,
  alerts,
  onConnect,
  onDisconnect,
  onClear,
}: LiveAlertsPanelProps) {
  const isConnected = socketState === "connected";
  const isConnecting = socketState === "connecting";

  return (
    <Card
      title="Live alerts"
      icon={Bell}
      action={
        <Badge className={socketStateBadgeClass(socketState)}>
          {socketState}
        </Badge>
      }
    >
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onConnect}
          disabled={isConnected || isConnecting}
        >
          <Link2 size={16} />
          {isConnecting ? "Connecting..." : "Connect"}
        </Button>

        <Button
          variant="outline"
          onClick={onDisconnect}
          disabled={!isConnected}
        >
          <Unlink2 size={16} />
          Disconnect
        </Button>

        <Button
          variant="ghost"
          onClick={onClear}
          disabled={alerts.length === 0}
        >
          <Trash2 size={16} />
          Clear alerts
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No live alerts yet.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {alert.title}
                    </div>

                    <Badge
                      className={cx(
                        "capitalize",
                        severityBadgeClass(alert.severity)
                      )}
                    >
                      {alert.severity || "info"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">

                    {alert.message ? (
                      <div>{alert.message}</div>
                    ) : null}

                    {alert.distance !== undefined ? (
                      <div className="font-medium text-sky-600 dark:text-sky-400">
                        📍{" "}
                        {alert.distance < 1
                          ? `${(alert.distance * 1000).toFixed(0)} meters away`
                          : `${alert.distance.toFixed(2)} km away`}
                      </div>
                    ) : null}

                    {alert.latitude !== undefined &&
                    alert.longitude !== undefined ? (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Coordinates: {alert.latitude.toFixed(5)},{" "}
                        {alert.longitude.toFixed(5)}
                      </div>
                    ) : null}

                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {alert.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}