import type { ApiPage } from "./api";

export type DisasterType =
  | "earthquake"
  | "flood"
  | "fire"
  | "storm"
  | "volcano"
  | "landslide"
  | "other";

export type DisasterSeverity = "low" | "medium" | "high" | "critical";
export type DisasterStatus = "active" | "monitoring" | "resolved";

export interface CreateDisasterRequest {
  title: string;
  description: string | null;
  type: DisasterType;
  severity: DisasterSeverity;
  status: DisasterStatus;
  radius: number;
  start_time: string;
  end_time: string | null;
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
}

export interface NearbyDisasterItem {
  id: number;
  title: string;
  description: string | null;
  severity: DisasterSeverity | string;
  radius: number | string;
  longitude: number | string;
  latitude: number | string;
  city: string | null;
  country: string | null;
  status?: string | null;
  type?: string | null;
  distance?: number | string | null;
}

export type NearbyDisastersResponse = ApiPage<NearbyDisasterItem>;