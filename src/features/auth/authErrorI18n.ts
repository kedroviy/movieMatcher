import type { TFunction } from 'i18next';

export function translateAuthError(t: TFunction, code: string | undefined, params?: { seconds?: number }): string {
    if (!code) {
        return t('auth.errors.AUTH_UNKNOWN');
    }
    const key = `auth.errors.${code}`;
    return t(key, { ...params, defaultValue: t('auth.errors.AUTH_UNKNOWN') });
}
