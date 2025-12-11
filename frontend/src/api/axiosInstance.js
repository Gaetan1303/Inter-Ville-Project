import axios from "axios";

// Vite exposes env vars on import.meta.env (process.env is undefined in browser)
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default API;
