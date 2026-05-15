import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import LiveAlertsPanel from "../components/dashboard/LiveAlertsPanel";
import { useAuth } from "../hooks/useAuth";
import { useWebSocket } from "../hooks/useWebSocket";
import { Navigate } from "react-router-dom";


export default function LiveAlertsPage() {
  const { user, isAuthenticated } = useAuth();
  const { socketState, alerts, connect, disconnect, clearAlerts } = useWebSocket();
  if (!isAuthenticated || user?.role !== "volunteer") {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <PageShell
      title="Live alerts"
      subtitle="Open a websocket connection and watch incoming disaster events appear in real time."
      actions={
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      }
    >
      <LiveAlertsPanel
        socketState={socketState}
        alerts={alerts}
        onConnect={connect}
        onDisconnect={disconnect}
        onClear={clearAlerts}
      />
    </PageShell>
  );
}