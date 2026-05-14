import { useState, type FormEvent } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { createDisaster } from "../api/endpoints";
import type { CreateDisasterRequest, DisasterSeverity, DisasterStatus, DisasterType } from "../types/disaster";
import { toDatetimeLocalValue } from "../utils/format";

export default function CreateDisasterPage() {
  const { token, user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "earthquake" as DisasterType,
    severity: "low" as DisasterSeverity,
    status: "active" as DisasterStatus,
    radius: "50",
    start_time: toDatetimeLocalValue(),
    end_time: "",
    latitude: "",
    longitude: "",
    city: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        }));
      },
      () => {
        setError("Could not access your current location.");
      }
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError("Login first to create a disaster.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const payload: CreateDisasterRequest = {
      title: form.title,
      description: form.description || null,
      type: form.type,
      severity: form.severity,
      status: form.status,
      radius: Number(form.radius),
      start_time: new Date(form.start_time).toISOString(),
      end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      city: form.city || null,
      country: form.country || null,
    };

    try {
      await createDisaster(payload, token);
      setSuccess("Disaster created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create disaster.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Create disaster manually"
      subtitle={
        user
          ? `Current user: ${user.email}. This page uses your protected POST /disasters endpoint.`
          : "Login first to create disasters."
      }
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
          Login first to use this protected endpoint.
        </div>
      ) : null}

      <Card title="Disaster form" icon={Sparkles}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Flood in ..."
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Short description"
            />
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as DisasterType }))}
            >
              <option value="earthquake">Earthquake</option>
              <option value="flood">Flood</option>
              <option value="fire">Fire</option>
              <option value="storm">Storm</option>
              <option value="volcano">Volcano</option>
              <option value="landslide">Landslide</option>
              <option value="other">Other</option>
            </Select>
            <Select
              label="Severity"
              value={form.severity}
              onChange={(e) => setForm((prev) => ({ ...prev, severity: e.target.value as DisasterSeverity }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as DisasterStatus }))}
            >
              <option value="active">Active</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
            </Select>
            <Input
              label="Radius"
              type="number"
              value={form.radius}
              onChange={(e) => setForm((prev) => ({ ...prev, radius: e.target.value }))}
            />
            <Input
              label="Start time"
              type="datetime-local"
              value={form.start_time}
              onChange={(e) => setForm((prev) => ({ ...prev, start_time: e.target.value }))}
            />
            <Input
              label="End time"
              type="datetime-local"
              value={form.end_time}
              onChange={(e) => setForm((prev) => ({ ...prev, end_time: e.target.value }))}
            />
            <Input
              label="Latitude"
              value={form.latitude}
              onChange={(e) => setForm((prev) => ({ ...prev, latitude: e.target.value }))}
            />
            <Input
              label="Longitude"
              value={form.longitude}
              onChange={(e) => setForm((prev) => ({ ...prev, longitude: e.target.value }))}
            />
            <Input
              label="City"
              value={form.city}
              onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
            />
            <Input
              label="Country"
              value={form.country}
              onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={!token || loading}>
              {loading ? "Creating..." : "Create disaster"}
            </Button>

            <Button type="button" variant="outline" onClick={handleCurrentLocation} disabled={loading}>
              Use my location
            </Button>
          </div>
        </form>
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