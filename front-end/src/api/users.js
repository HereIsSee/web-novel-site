import { httpRequest } from "./http";

export const getCurrentUser = () => httpRequest("/api/auth/me");

export const loginUser = (credentials) =>
  httpRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const registerUser = (data) =>
  httpRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
