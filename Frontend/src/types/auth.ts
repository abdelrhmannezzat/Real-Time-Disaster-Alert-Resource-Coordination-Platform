export type UserRole = "ADMIN" | "COORDINATOR" | "VOLUNTEER";

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  role: UserRole;
}

export interface LoginResponse {
  id: number;
  email: string;
  accessToken: string;
  type: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  role: UserRole;
}