import * as Keychain from 'react-native-keychain';

export type AccessTokenPayload = {
    id: number;
    email?: string;
    typ?: string;
    exp?: number;
};

export const saveToken = async (token: string) => {
    await Keychain.setGenericPassword('token', token, { service: 'token_guard' });
};

export const getToken = async () => {
    try {
        const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
        if (credentials) {
            return credentials.password;
        }
        return null;
    } catch (error) {
        throw new Error();
        return null;
    }
};

export const removeToken = async () => {
    await Keychain.resetGenericPassword({ service: 'token_guard' });
};

const decodeBase64 = (value: string): string => {
    if (typeof globalThis.atob === 'function') {
        return globalThis.atob(value);
    }
    // Jest / Node fallback
    return Buffer.from(value, 'base64').toString('utf8');
};

const decodeJwtPayloadJson = (token: string): Record<string, unknown> | null => {
    try {
        const payloadPart = token.split('.')[1];
        if (!payloadPart) {
            return null;
        }
        const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const padLength = (4 - (normalized.length % 4)) % 4;
        const padded = normalized + '='.repeat(padLength);
        const json = decodeBase64(padded);
        return JSON.parse(json) as Record<string, unknown>;
    } catch {
        return null;
    }
};

const parseUserId = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string' && /^\d+$/.test(value)) {
        return Number(value);
    }
    return null;
};

/** Parses JWT payload without verifying the signature. */
export const readAccessTokenPayload = (token: string): AccessTokenPayload | null => {
    const raw = decodeJwtPayloadJson(token.trim());
    if (!raw) {
        return null;
    }
    const id = parseUserId(raw.id);
    if (id == null) {
        return null;
    }
    const exp = typeof raw.exp === 'number' ? raw.exp : undefined;
    const email = typeof raw.email === 'string' ? raw.email : undefined;
    const typ = typeof raw.typ === 'string' ? raw.typ : undefined;
    return { id, email, typ, exp };
};

export const isAccessTokenExpired = (payload: AccessTokenPayload): boolean => {
    if (typeof payload.exp !== 'number') {
        return false;
    }
    return payload.exp * 1000 <= Date.now();
};

/** Reads `id` from a JWT access token payload (no signature verification). */
export const readUserIdFromJwt = (token: string): number | null => {
    const payload = readAccessTokenPayload(token);
    if (!payload || isAccessTokenExpired(payload)) {
        return null;
    }
    return payload.id;
};

/** Resolves current user id from a non-expired stored access token. */
export const resolveUserIdFromToken = async (): Promise<number | null> => {
    const token = await getToken();
    if (!token) {
        return null;
    }
    return readUserIdFromJwt(token);
};

/** Returns true when keychain has a token that is missing or past `exp`. */
export const isStoredAccessTokenExpired = async (): Promise<boolean> => {
    const token = await getToken();
    if (!token) {
        return true;
    }
    const payload = readAccessTokenPayload(token);
    if (!payload) {
        return true;
    }
    return isAccessTokenExpired(payload);
};
