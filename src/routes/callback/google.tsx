import { createFileRoute } from '@tanstack/react-router';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';
import { OAUTH } from '../../utils/constants';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export const Route = createFileRoute('/callback/google')({
    component: () => <GoogleCallback />,
});

type TokenResponse = {
    accessToken: string;
};

type TokenRequest = {
    authorizationCode: string;
    codeVerifier: string;
    redirectUri: string;
};

function GoogleCallback() {
    // persist the state of the exchange through re-rendering
    const exchangeState = useRef<'idle' | 'pending' | 'completed'>('idle');

    function onToastClose() {
        sessionStorage.removeItem('code_verifier');
        sessionStorage.removeItem('state');
        apiClient.redirect('/');
    }

    const { mutate: exchangeToken } = useMutation<TokenResponse, Error, TokenRequest>({
        mutationFn: (body: TokenRequest): Promise<TokenResponse> => {
            return apiClient.sendRequest<TokenResponse>('POST', '/login/google', body);
        },
        onSuccess: (data: TokenResponse) => {
            exchangeState.current = 'completed';
            toast.success('Login successful. Redirect after 3 seconds', {
                onAutoClose: () => {
                    sessionStorage.setItem('access_token', data.accessToken);
                    onToastClose();
                },
            });
        },
        onError: (error: Error) => {
            exchangeState.current = 'idle';
            toast.error(error.message, {
                onAutoClose: onToastClose,
            });
        },
        retry: false,
    });

    useEffect(() => {
        // Skip if we're already processing or completed
        if (exchangeState.current !== 'idle') return;

        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        if (!code) {
            toast.error('Login failed', {
                onAutoClose: onToastClose,
            });
            return;
        }

        const receivedState = url.searchParams.get('state');
        const state = sessionStorage.getItem('state');
        if (state !== receivedState) {
            toast.error('Login failed', {
                onAutoClose: onToastClose,
            });
            return;
        }

        const codeVerifier = sessionStorage.getItem('code_verifier');
        if (!codeVerifier) {
            toast.error('Login failed', {
                onAutoClose: onToastClose,
            });
            return;
        }

        exchangeState.current = 'pending';
        exchangeToken({
            authorizationCode: code,
            codeVerifier: codeVerifier,
            redirectUri: OAUTH.GOOGLE.REDIRECT_URI,
        });
    }, [exchangeToken]);

    return (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-2">
            <div className="flex items-end gap-2">
                <span className="loading loading-infinity loading-xl"></span>
                <span className="text-xl font-bold">Signing you in...</span>
            </div>
            <p>Please wait while we complete your login.</p>
        </div>
    );
}
