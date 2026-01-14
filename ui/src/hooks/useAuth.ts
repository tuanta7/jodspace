import { useMutation } from '@tanstack/react-query';
import { authApi, GuestLoginRequest, GoogleLoginRequest } from '../services/authApi';
import { useCredentialsStore } from '../store/credentialsStore';

export const useGuestLogin = () => {
    const setCredentials = useCredentialsStore((state) => state.setCredentials);

    return useMutation({
        mutationFn: (data: GuestLoginRequest) => authApi.loginAsGuest(data),
        onSuccess: (response) => {
            setCredentials(response.accessToken, response.user);
        },
    });
};

export const useGoogleLogin = () => {
    const setCredentials = useCredentialsStore((state) => state.setCredentials);

    return useMutation({
        mutationFn: (data: GoogleLoginRequest) => authApi.loginWithGoogle(data),
        onSuccess: (response) => {
            setCredentials(response.accessToken, response.user);
        },
    });
};

export const useLogout = () => {
    const clearCredentials = useCredentialsStore((state) => state.clearCredentials);

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            clearCredentials();
        },
        onError: () => {
            // Clear credentials even if API call fails
            clearCredentials();
        },
    });
};

