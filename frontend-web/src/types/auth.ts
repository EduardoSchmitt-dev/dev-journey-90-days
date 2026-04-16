export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  acessToken: string;
  refreshToken: string;
};

// this file defines types for the authentication flow in the app
