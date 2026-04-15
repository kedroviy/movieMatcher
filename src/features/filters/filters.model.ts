export type KpPossibleValue = Readonly<{
    name: string;
    slug: string;
}>;

export type FiltersResponse = Readonly<{
    provider: 'KINOPOISK';
    locale: 'ru';
    genres: KpPossibleValue[];
    countries: KpPossibleValue[];
    refreshedAt: string;
}>;
