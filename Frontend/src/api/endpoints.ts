import { apiRequest } from "./client";
import { buildQueryString } from "../utils/network";
import type { ApiPage } from "../types/api";
import type { UserItem } from "../types/user";
import type {
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";
import type {
  CreateDisasterRequest,
  DisasterSeverity,
  DisasterType,
  NearbyDisasterItem,
  NearbyDisastersResponse,
} from "../types/disaster";

const API_PREFIX = "/api/v1";

export function loginUser(payload: LoginRequest) {
  return apiRequest<LoginResponse>(`${API_PREFIX}/auth/login`, {
    method: "POST",
    body: payload,
  });
}

export function registerUser(payload: RegisterRequest) {
  return apiRequest<RegisterResponse>(`${API_PREFIX}/auth/register`, {
    method: "POST",
    body: payload,
  });
}

export function getNearbyDisasters(
  params: {
    lat: string | number;
    lng: string | number;
    rad: string | number;
    sev?: DisasterSeverity | "";
    typ?: DisasterType | "";
  },
  token?: string
) {
  const qs = buildQueryString({
    lat: params.lat,
    lng: params.lng,
    rad: params.rad,
    sev: params.sev,
    typ: params.typ,
  });

  return apiRequest<NearbyDisastersResponse>(
    `${API_PREFIX}/disasters/nearby${qs}`,
    token ? { token } : {}
  );
}

export function createDisaster(payload: CreateDisasterRequest, token: string) {
  return apiRequest<unknown>(`${API_PREFIX}/disasters`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function activateUser(userId: string | number, token: string) {
  return apiRequest<unknown>(`${API_PREFIX}/users/${userId}/activate`, {
    method: "PATCH",
    token,
  });
}

export function deactivateUser(userId: string | number, token: string) {
  return apiRequest<unknown>(`${API_PREFIX}/users/${userId}/deactivate`, {
    method: "PATCH",
    token,
  });
}

export function getDisasterById(disasterId: string | number, token: string) {
  return apiRequest<unknown>(`${API_PREFIX}/disasters/${disasterId}`, {
    token,
  });
}

export function getUsers(page: number, token: string) {
  return apiRequest<ApiPage<UserItem>>(
    `${API_PREFIX}/users?page=${page}`,
    {
      token,
    }
  );
}