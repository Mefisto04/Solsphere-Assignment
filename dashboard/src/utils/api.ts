import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000";

export const api = axios.create({
    baseURL,
    timeout: 15000,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export function loginApi(email: string, password: string) {
    // Your server should expose POST /api/auth/login -> { token }
    return api.post<{ token: string }>("/api/auth/login", { email, password }).then(r => r.data);
}

export function getMachines(params?: Record<string, string | number | boolean>) {
    return api.get("/api/machines", { params }).then(r => r.data);
}
