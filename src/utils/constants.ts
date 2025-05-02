export const THEMES = {
    DARK: 'luxury',
    LIGHT: 'winter',
};

export const TOAST_DURATION = 3000000;

export const OAUTH = {
    CODE_VERIFIER_LENGTH: 80,
    STATE_LENGTH: 16,
    GOOGLE: {
        AUTHORIZE_ENDPOINT: 'https://accounts.google.com/o/oauth2/v2/auth',
        PKCE_CODE_CHALLENGE_METHOD: 'S256',
        SCOPES: [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'openid',
        ],
        INCLUDE_GRANTED_SCOPE: true,
        ACCESS_TYPE: 'offline',
        RESPONSE_TYPE: 'code', // authorization code flow
        REDIRECT_URI: 'http://localhost:5173/callback/google',
        CLIENT_ID: '1013864550314-fd16i9tgvi9rkl8n8gc093pbblqa4re2.apps.googleusercontent.com',
    },
};

export const API = {
    BASE_URL: 'http://localhost:9731/api/v1',
};
