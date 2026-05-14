import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import {
  activateUser,
  deactivateUser,
  getUsers,
} from "../api/endpoints";

import type { UserItem } from "../types/user";
import type { ApiPage } from "../types/api";

import PageShell from "../components/layout/PageShell";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

import { formatEnumLabel } from "../utils/format";

export default function AdminPage() {
  const { token, user } = useAuth();

  const [page, setPage] = useState(1);

  const [data, setData] = useState<ApiPage<UserItem>>({
    items: [],
  });

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canManageUsers = user?.role === "admin";

  useEffect(() => {
    if (!token || !canManageUsers) return;

    fetchUsers();
  }, [page, token]);

  async function fetchUsers() {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const response = await getUsers(page, token);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(
    userId: number,
    mode: "activate" | "deactivate"
  ) {
    if (!token) return;

    setActionLoading(userId);
    setError("");
    setSuccess("");

    try {
      if (mode === "activate") {
        await activateUser(userId, token);
      } else {
        await deactivateUser(userId, token);
      }

      setSuccess(`User ${userId} ${mode}d successfully.`);

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <PageShell
      title="User control"
      subtitle={`Current role: ${
        user ? formatEnumLabel(user.role) : "Guest"
      }`}
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
      {!canManageUsers ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Only admins can manage users.
        </div>
      ) : null}

      <Card title="Users">
        {loading ? (
          <div className="text-sm text-slate-500">
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.items.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-100 dark:border-slate-900"
                  >
                    <td className="px-4 py-4">{u.id}</td>

                    <td className="px-4 py-4">{u.email}</td>

                    <td className="px-4 py-4">
                      {formatEnumLabel(u.role)}
                    </td>

                    <td className="px-4 py-4">
                      {u.approved ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          disabled={
                            u.approved || actionLoading === u.id
                          }
                          onClick={() =>
                            handleAction(u.id, "activate")
                          }
                        >
                          <CheckCircle2 size={16} />
                          Activate
                        </Button>

                        <Button
                          variant="danger"
                          disabled={
                            !u.approved || actionLoading === u.id
                          }
                          onClick={() =>
                            handleAction(u.id, "deactivate")
                          }
                        >
                          <XCircle size={16} />
                          Deactivate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          {Array.from(
            { length: data.pages ?? 1 },
            (_, index) => (
              <Button
                key={index + 1}
                variant={
                  page === index + 1 ? "primary" : "outline"
                }
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </Button>
            )
          )}

          <Button
            variant="outline"
            disabled={page >= (data.pages ?? 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
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