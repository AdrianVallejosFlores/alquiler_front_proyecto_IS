import axios from "axios";

// Instancia global de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,  // <= Muy importante
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Error API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
