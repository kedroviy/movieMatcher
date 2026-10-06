import {
    DEFAULT_USER_LANGUAGE,
    normalizeUserLanguage,
} from '../user-language';

describe('normalizeUserLanguage', () => {
    it('maps locale tags to supported codes', () => {
        expect(normalizeUserLanguage('en-US')).toBe('en');
        expect(normalizeUserLanguage('ru_RU')).toBe('ru');
        expect(normalizeUserLanguage('JA')).toBe('ja');
    });

    it('falls back to default for unknown values', () => {
        expect(normalizeUserLanguage(undefined)).toBe(DEFAULT_USER_LANGUAGE);
        expect(normalizeUserLanguage('pt')).toBe(DEFAULT_USER_LANGUAGE);
        expect(normalizeUserLanguage('')).toBe(DEFAULT_USER_LANGUAGE);
    });
});
