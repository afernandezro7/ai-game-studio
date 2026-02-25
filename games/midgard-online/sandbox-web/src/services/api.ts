import axios from "axios";

/**
 * Axios instance configured for the Midgard Online API.
 * Proxy configured in vite.config.ts routes /api → localhost:3001.
 */
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("midgard_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("midgard_token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  },
);

export default api;
