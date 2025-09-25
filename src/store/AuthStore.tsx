import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

export type User = {
    email: string | undefined,
    displayName: string | undefined,
    avatar?: string | undefined
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    roles: string[] | null;
    accessTokenExp: number | null;
    login: (user: User, token?: string | null, roles?: string[] | null, exp?: number | null) => void;
    logout: () => void;

}

export const useAuthStore = create<AuthState>()(persist((set) => ({
    isAuthenticated: false,
    user: null,
    token: null,
    roles: null,
    accessTokenExp: null,
    login: (user, token = null, roles = null, exp = null) => set({
        isAuthenticated: true,
        user: { ...user, avatar: "/lawyer.png" },
        token: token,
        accessTokenExp: exp,
        roles: roles
    }),
    logout: () => set({
        isAuthenticated: false,
        user: null,
        token: null,
        roles: null,
        accessTokenExp: null
    }),
}), {
    name: "auth-session",
    storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
}));
