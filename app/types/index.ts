export enum AuthErrorCodes {
  INVALID_LOGIN_CREDENTIALS = "Invalid login credentials",
  EMAIL_CHANGE_NEEDS_VERIFICATION = "Email change needs verification",
  EMAIL_EXISTS = "Email already exists",
  INVALID_EMAIL = "Invalid email address",
  INVALID_PASSWORD = "Invalid password",
  TOO_MANY_ATTEMPTS_TRY_LATER = "Too many attempts, try again later",
  WEAK_PASSWORD = "Weak password",
  NETWORK_ERROR = "Network error"
}

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  verified: boolean;
  token: string;
}

export interface LoginResult {
  user?: AuthUser;
  error?: AuthErrorCodes;
}

export interface FetcherData {
  error?: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface Todo {
  id: string;
  userId: string;
  task: string;
  completed: boolean;
  createdAt: Date;
}
