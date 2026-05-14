import type { FormEvent } from "react";
import { MapPin, Search } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

export interface NearbySearchFilters {
  lat: string;
  lng: string;
  rad: string;
  sev: string;
  typ: string;
}

interface NearbySearchFormProps {
  values: NearbySearchFilters;
  disabled?: boolean;
  loading?: boolean;
  onChange: (field: keyof NearbySearchFilters, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUseLocation?: () => void;
}

export default function NearbySearchForm({
  values,
  disabled = false,
  loading = false,
  onChange,
  onSubmit,
  onUseLocation,
}: NearbySearchFormProps) {
  return (
    <Card title="Nearby disaster search" icon={MapPin}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Input
            label="Latitude"
            value={values.lat}
            onChange={(e) => onChange("lat", e.target.value)}
            disabled={disabled}
            placeholder="30.0444"
          />
          <Input
            label="Longitude"
            value={values.lng}
            onChange={(e) => onChange("lng", e.target.value)}
            disabled={disabled}
            placeholder="31.2357"
          />
          <Input
            label="Radius (km)"
            value={values.rad}
            onChange={(e) => onChange("rad", e.target.value)}
            disabled={disabled}
            placeholder="50"
          />
          <Select
            label="Severity"
            value={values.sev}
            onChange={(e) => onChange("sev", e.target.value)}
            disabled={disabled}
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
          <Select
            label="Type"
            value={values.typ}
            onChange={(e) => onChange("typ", e.target.value)}
            disabled={disabled}
          >
            <option value="">All</option>
            <option value="earthquake">Earthquake</option>
            <option value="flood">Flood</option>
            <option value="fire">Fire</option>
            <option value="storm">Storm</option>
            <option value="volcano">Volcano</option>
            <option value="landslide">Landslide</option>
            <option value="other">Other</option>
          </Select>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={disabled || loading}>
            <Search size={16} />
            {loading ? "Searching..." : "Search nearby"}
          </Button>

          {onUseLocation ? (
            <Button type="button" variant="outline" onClick={onUseLocation} disabled={disabled || loading}>
              Use my location
            </Button>
          ) : null}
        </div>
      </form>

      {disabled ? (
        <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Login first to call this protected endpoint.
        </div>
      ) : null}
    </Card>
  );
}