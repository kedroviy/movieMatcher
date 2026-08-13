const AUTH_ENTRY_PATH_MARKERS: readonly string[] = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-id-token',
    '/auth/session',
    '/auth/logout',
    '/auth/send-code-to-email',
    '/auth/verify-code',
    '/auth/change-password',
];

type SessionExpiredHandler = () => void;

let sessionExpiredHandler: SessionExpiredHandler | null = null;
let isHandlingSessionExpired = false;

/** Registers the app-level logout callback (call once from App root). */
export const registerSessionExpiredHandler = (handler: SessionExpiredHandler): void => {
    sessionExpiredHandler = handler;
};

export const isAuthEntryRequestUrl = (url: string | undefined): boolean => {
    if (!url) {
        return false;
    }
    return AUTH_ENTRY_PATH_MARKERS.some((marker) => url.includes(marker));
};

/** Forces logout when access token is expired or API returns 401/403. */
export const notifySessionExpired = (): void => {
    if (isHandlingSessionExpired || !sessionExpiredHandler) {
        return;
    }
    isHandlingSessionExpired = true;
    try {
        sessionExpiredHandler();
    } finally {
        setTimeout(() => {
            isHandlingSessionExpired = false;
        }, 0);
    }
};
