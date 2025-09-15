// Extend the Window interface to include __ENV__
declare global {
    interface Window {
        __ENV__: Config;
    }
}

interface Config {
    API: {
        BASE_URL: string;
    };
    OAUTH: {
        CODE_VERIFIER_LENGTH: number;
        STATE_LENGTH: number;
        GOOGLE: Provider;
        GITHUB: Provider;
    };
}

interface Provider {
    PROVIDER_NAME: string;
    AUTHORIZE_ENDPOINT: string;
    PKCE_CODE_CHALLENGE_METHOD: string;
    SCOPES: string[];
    INCLUDE_GRANTED_SCOPE: boolean;
    ACCESS_TYPE: string;
    RESPONSE_TYPE: string;
    REDIRECT_URI: string;
    CLIENT_ID: string;
}

const env: Config = window.__ENV__;
export const OAUTH = env.OAUTH;
export const API = env.API;
