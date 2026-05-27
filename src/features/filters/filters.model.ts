export type FiltersLocale = 'ru' | 'en' | 'es';

export type KpPossibleValue = Readonly<{
    name: string;
    slug: string;
    kpName: string;
}>;

export type FiltersResponse = Readonly<{
    provider: 'KINOPOISK';
    locale: FiltersLocale;
    genres: KpPossibleValue[];
    countries: KpPossibleValue[];
    refreshedAt: string;
}>;

export function resolveFiltersLocale(language?: string): FiltersLocale {
    if (language === 'en' || language === 'es' || language === 'ru') {
        return language;
    }
    return 'en';
}
