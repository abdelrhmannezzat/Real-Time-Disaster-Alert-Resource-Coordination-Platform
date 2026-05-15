import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Activity, Bell, ShieldAlert, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getNearbyDisasters } from "../api/endpoints";
import type { NearbyDisasterItem } from "../types/disaster";
import { extractPageItems } from "../utils/response";
import PageShell from "../components/layout/PageShell";
import StatsCard from "../components/dashboard/StatsCard";
import NearbySearchForm, { type NearbySearchFilters } from "../components/dashboard/NearbySearchForm";
import DisasterList from "../components/dashboard/DisasterList";
import { toDatetimeLocalValue } from "../utils/format";

export default function DashboardPage() {
  const { token, user } = useAuth();

  const [filters, setFilters] = useState<NearbySearchFilters>({
    lat: "30.0444",
    lng: "31.2357",
    rad: "50",
    sev: "",
    typ: "",
  });

  const [items, setItems] = useState<NearbyDisasterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchNearby = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await getNearbyDisasters(
        {
          lat: filters.lat,
          lng: filters.lng,
          rad: filters.rad,
          sev: filters.sev as any,
          typ: filters.typ as any,
        },
        token || undefined
      );

      setItems(extractPageItems<NearbyDisasterItem>(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = items.length;
    const high = items.filter((item) => String(item.severity).toLowerCase() === "high").length;
    const critical = items.filter((item) => String(item.severity).toLowerCase() === "critical").length;

    return { total, high, critical };
  }, [items]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFilters((prev) => ({
          ...prev,
          lat: String(position.coords.latitude),
          lng: String(position.coords.longitude),
        }));
      },
      () => {
        setError("Could not access your current location.");
      }
    );
  };

  return (
    <PageShell
      title="Dashboard"
      subtitle={
        user
          ? `Signed in as ${user.email}. Search nearby disasters and inspect real-time coordination data.`
          : "Search nearby disasters without logging in."
      }
      actions={
        <>
          {user?.role === "volunteer" && (
            <Link
              to="/live"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
            >
              <Bell size={16} />
              Live alerts
            </Link>
          )}

          {user?.role === "coordinator" && (
            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"
            >
              <Sparkles size={16} />
              Create disaster
            </Link>
          )}
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Nearby disasters" value={stats.total} subtitle="Current search results" icon={Activity} />
        <StatsCard title="High severity" value={stats.high} subtitle="High severity incidents" icon={ShieldAlert} />
        <StatsCard title="Critical alerts" value={stats.critical} subtitle="Critical incidents" icon={Bell} />
      </div>

      <NearbySearchForm
        values={filters}
        loading={loading}
        onChange={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))}
        onSubmit={searchNearby}
        onUseLocation={useMyLocation}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <DisasterList items={items} loading={loading} />

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          How nearby search works
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This dashboard uses your location (or manually entered coordinates) to fetch active disasters within a selected radius using a geospatial query (PostGIS).
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Radius-based filtering
            </div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Results are filtered using distance in kilometers from the selected point.
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Real-time updates
            </div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Live alerts are streamed via WebSocket when new disasters are detected near you.
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Severity levels
            </div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Disasters are classified as low, medium, high, or critical based on impact.
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Data freshness
            </div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Results reflect the latest stored incidents and incoming real-time updates.
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}