import type { ApiPage } from "./api";

export type DisasterType =
  | "EARTHQUAKE"
  | "FLOOD"
  | "FIRE"
  | "STORM"
  | "VOLCANO"
  | "LANDSLIDE"
  | "OTHER";

export type DisasterSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type DisasterStatus = "ACTIVE" | "MONITORING" | "RESOLVED";

export interface CreateDisasterRequest {
  title: string;
  description: string | null;
  type: DisasterType;
  severity: DisasterSeverity;
  status: DisasterStatus;
  radius: number;
  startTime: string;
  endTime: string | null;
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
  startTime?: string;
}

export type NearbyDisastersResponse = ApiPage<NearbyDisasterItem>;