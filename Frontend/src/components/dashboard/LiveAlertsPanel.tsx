import { Bell, Link2, Unlink2, Trash2 } from "lucide-react";
import type { LiveAlert, SocketState } from "../../types/websocket";
import { socketStateBadgeClass, severityBadgeClass } from "../../utils/format";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";
import { cx } from "../../utils/classNames";

interface LiveAlertsPanelProps {
  socketState: SocketState;
  userId: string;
  alerts: LiveAlert[];
  onUserIdChange: (value: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onClear: () => void;
}

export default function LiveAlertsPanel({
  socketState,
  userId,
  alerts,
  onUserIdChange,
  onConnect,
  onDisconnect,
  onClear,
}: LiveAlertsPanelProps) {
  return (
    <Card
      title="Live alerts"
      icon={Bell}
      action={<Badge className={socketStateBadgeClass(socketState)}>{socketState}</Badge>}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <Input
          label="User ID"
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          placeholder="Enter your user id"
        />

        <div className="flex items-end">
          <Button onClick={onConnect}>
            <Link2 size={16} />
            Connect
          </Button>
        </div>

        <div className="flex items-end">
          <Button variant="outline" onClick={onDisconnect}>
            <Unlink2 size={16} />
            Disconnect
          </Button>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="ghost" onClick={onClear}>
          <Trash2 size={16} />
          Clear alerts
        </Button>
      </div>

      <div className="mt-4 space-y-3">
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
                    <div className="font-bold text-slate-900 dark:text-white">{alert.title}</div>
                    <Badge className={cx("capitalize", severityBadgeClass(alert.severity))}>
                      {alert.severity || "info"}
                    </Badge>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                    {alert.message}
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{alert.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}