import { useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { activateUser, deactivateUser } from "../api/endpoints";
import PageShell from "../components/layout/PageShell";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { formatEnumLabel } from "../utils/format";

export default function AdminPage() {
  const { token, user } = useAuth();

  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canManageUsers = user?.role === "admin" || user?.role === "coordinator";

  const handleAction = async (mode: "activate" | "deactivate") => {
    if (!token) {
      setError("Login first.");
      return;
    }

    if (!userId) {
      setError("Enter a user ID.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "activate") {
        await activateUser(userId, token);
      } else {
        await deactivateUser(userId, token);
      }

      setSuccess(`User ${userId} ${mode}d successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="User control"
      subtitle={`Current role: ${user ? formatEnumLabel(user.role) : "Guest"}. This page uses your activate/deactivate endpoints.`}
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
      {!token ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Login first to use protected user management endpoints.
        </div>
      ) : null}

      {!canManageUsers ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Your current role is not meant for user management, but the backend will still enforce the final permission check.
        </div>
      ) : null}

      <Card title="Activate / deactivate user">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <Input
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter the target user id"
          />

          <div className="flex items-end">
            <Button
              disabled={!token || loading}
              onClick={() => handleAction("activate")}
            >
              <CheckCircle2 size={16} />
              Activate
            </Button>
          </div>

          <div className="flex items-end">
            <Button
              variant="danger"
              disabled={!token || loading}
              onClick={() => handleAction("deactivate")}
            >
              <XCircle size={16} />
              Deactivate
            </Button>
          </div>
        </div>
      </Card>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {success}
        </div>
      ) : null}
    </PageShell>
  );
}