import { randomString } from './random.ts';
import { OAUTH } from './constants.ts';

function generateState(): string {
    return randomString(OAUTH.STATE_LENGTH);
}

function generateCodeVerifier(): string {
    return randomString(OAUTH.CODE_VERIFIER_LENGTH);
}

async function generateS256CodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(codeVerifier));
    const hashBytes = new Uint8Array(hashBuffer);
    const hashBase64 = btoa(String.fromCharCode(...hashBytes));
    return hashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export { generateState, generateCodeVerifier, generateS256CodeChallenge };
