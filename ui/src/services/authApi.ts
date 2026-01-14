import axios from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (window as any).CONFIG?.API_URL ||
    'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface GuestLoginRequest {
    nickname: string;
}

export interface GoogleLoginRequest {
    credential: string;
}

export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        nickname: string;
        email?: string;
        avatar?: string;
        isGuest: boolean;
    };
}

export const authApi = {
    loginAsGuest: async (data: GuestLoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/login/guest', data);
        return response.data;
    },

    loginWithGoogle: async (data: GoogleLoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/login/google', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/login/logout');
    },

    refreshToken: async (): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/login/refresh');
        return response.data;
    },
};
