import React from 'react';

import Button from '../Button.tsx';

import { OAUTH } from '../../utils/constants.ts';
import { apiClient } from '../../services/apiClient.ts';
import { generateCodeVerifier, generateS256CodeChallenge, generateState } from '../../utils/oauth.ts';

function LoginButton() {
    const handleRedirect = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateS256CodeChallenge(codeVerifier);

        sessionStorage.setItem('state', state);
        sessionStorage.setItem('code_verifier', codeVerifier);

        const queryParams = new URLSearchParams({
            scope: OAUTH.GOOGLE.SCOPES.join(' '),
            redirect_uri: OAUTH.GOOGLE.REDIRECT_URI,
            response_type: OAUTH.GOOGLE.RESPONSE_TYPE,
            client_id: OAUTH.GOOGLE.CLIENT_ID,
            code_challenge_method: OAUTH.GOOGLE.PKCE_CODE_CHALLENGE_METHOD,
            code_challenge: codeChallenge,
            state: state,
            access_type: OAUTH.GOOGLE.ACCESS_TYPE,
            prompt: 'consent', // for testing purposes
        });

        const googleAuthorizeUrl = OAUTH.GOOGLE.AUTHORIZE_ENDPOINT + '?' + queryParams.toString();
        apiClient.redirect(googleAuthorizeUrl);
    };

    return (
        <Button
            isLoading={false}
            icon={
                <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                    className="w-4 h-4"
                >
                    <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                </svg>
            }
            className="btn btn-sm btn-primary btn-outline"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleRedirect(e)}
        >
            <span className="mx-2">Login</span>
        </Button>
    );
}

export default LoginButton;
