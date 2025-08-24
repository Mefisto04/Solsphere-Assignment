import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

type TokenClaims = { sub?: string; exp?: number;[k: string]: unknown };

type AuthState = {
    token: string | null;
    user: TokenClaims | null;
    login: (token: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            login: (token) => {
                let claims: TokenClaims | null = null;
                try { claims = jwtDecode(token) as TokenClaims; } catch {
                    console.error("Invalid token");
                }
                set({ token, user: claims });
            },
            logout: () => set({ token: null, user: null }),
        }),
        { name: "auth" }
    )
);
