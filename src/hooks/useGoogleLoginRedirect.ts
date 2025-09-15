import { OAUTH } from '../utils/config.ts';
import { apiClient } from '../services/apiClient.ts';
import { generateCodeVerifier, generateS256CodeChallenge, generateState } from '../utils/oauth.ts';

export function useGoogleLoginRedirect() {
    return async () => {
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
            prompt: 'consent',
        });

        const googleAuthorizeUrl = OAUTH.GOOGLE.AUTHORIZE_ENDPOINT + '?' + queryParams.toString();
        apiClient.redirect(googleAuthorizeUrl);
    };
}
