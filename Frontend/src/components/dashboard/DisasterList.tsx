import { MapPin, ShieldAlert } from "lucide-react";
import type { NearbyDisasterItem } from "../../types/disaster";
import Card from "../common/Card";
import Badge from "../common/Badge";
import { cx } from "../../utils/classNames";
import { formatCoordinate, formatEnumLabel, severityBadgeClass } from "../../utils/format";

interface DisasterListProps {
  items: NearbyDisasterItem[];
  loading?: boolean;
}

export default function DisasterList({ items, loading = false }: DisasterListProps) {
  return (
    <Card title="Nearby disaster results" icon={ShieldAlert}>
      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Loading disasters...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No disasters found yet. Run a search to populate the list.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>

                    <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {formatEnumLabel(String(item.type))}
                    </Badge>

                    <Badge className={cx("capitalize", severityBadgeClass(String(item.severity)))}>
                      {formatEnumLabel(String(item.severity))}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item.description || "No description provided."}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-950">
                      Radius: {item.radius} km
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-950">
                      Lat: {formatCoordinate(item.latitude)}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-950">
                      Lng: {formatCoordinate(item.longitude)}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-950">
                      {item.city || "Unknown city"}, {item.country || "Unknown country"}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin size={16} />
                  #{item.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}