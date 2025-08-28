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
    provider: string;
};

function GoogleCallback() {
    // persist the state of the exchange through re-rendering
    const exchangeState = useRef<'idle' | 'pending' | 'completed'>('idle');

    function onToastClose() {
        sessionStorage.removeItem('code_verifier');
        sessionStorage.removeItem('state');
        apiClient.redirect('/workspace');
    }

    const { mutate: exchangeToken } = useMutation<TokenResponse, Error, TokenRequest>({
        mutationFn: (body: TokenRequest): Promise<TokenResponse> => {
            return apiClient.sendRequest<TokenResponse>('POST', '/oauth/token', {
                data: body,
                withCredentials: true,
            });
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
        if (exchangeState.current !== 'idle') return;

        const url = new URL(window.location.href);
        const receivedState = url.searchParams.get('state');
        const state = sessionStorage.getItem('state');
        if (state !== receivedState) {
            toast.error('Login failed', {
                onAutoClose: onToastClose,
            });
            return;
        }

        const err = url.searchParams.get('error');
        if (err != null) {
            toast.error('Login failed: ' + err, {
                onAutoClose: onToastClose,
            });
            return;
        }

        const code = url.searchParams.get('code');
        if (!code) {
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
            provider: OAUTH.GOOGLE.PROVIDER_NAME,
        });
    }, [exchangeToken]);

    return (
        <div className="flex h-[90vh] flex-col items-center justify-center gap-2">
            <div className="flex items-end gap-2">
                <span className="loading loading-infinity loading-xl"></span>
                <span className="text-xl font-bold">Signing you in...</span>
            </div>
            <p>Please wait while we complete your login.</p>
        </div>
    );
}
