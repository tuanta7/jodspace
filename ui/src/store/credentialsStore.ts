import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    nickname: string;
    email?: string;
    avatar?: string;
    isGuest: boolean;
}

interface CredentialsState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setCredentials: (token: string, user: User) => void;
    clearCredentials: () => void;
}

export const useCredentialsStore = create<CredentialsState>()(
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            isAuthenticated: false,
            setCredentials: (token, user) =>
                set({
                    accessToken: token,
                    user,
                    isAuthenticated: true,
                }),
            clearCredentials: () =>
                set({
                    accessToken: null,
                    user: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'jodspace-credentials',
        }
    )
);

