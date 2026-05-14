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

    if (!token) {
      setError("Login first to search nearby disasters.");
      return;
    }

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
        token
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
          : "Login to search and use the protected features."
      }
      actions={
        <>
          <Link
            to="/live"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
          >
            <Bell size={16} />
            Live alerts
          </Link>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"
          >
            <Sparkles size={16} />
            Create disaster
          </Link>
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
        disabled={!token}
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

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Search notes</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The query below uses your PostGIS nearby endpoint. Default radius input is in kilometers.
        </p>
        <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Example time field format used in your create page: {toDatetimeLocalValue()}
        </div>
      </div>
    </PageShell>
  );
}