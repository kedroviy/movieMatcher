import { FilterOption } from '../sm.model';

const UNRANKED_COUNTRY_RANK = Number.MAX_SAFE_INTEGER;

/** Major film industries, in display order. Names cover Kinopoisk `kpName` and localized labels. */
const POPULAR_FILM_COUNTRY_GROUPS: readonly (readonly string[])[] = [
    ['США', 'USA', 'United States', 'Estados Unidos'],
    ['Япония', 'Japan', 'Japón'],
    ['Франция', 'France', 'Francia'],
    ['Германия', 'Germany', 'Alemania'],
    ['Корея Южная', 'Южная Корея', 'South Korea', 'Corea del Sur'],
    ['Великобритания', 'United Kingdom', 'Great Britain', 'UK', 'Reino Unido'],
    ['Россия', 'Russia', 'Rusia'],
    ['Италия', 'Italy', 'Italia'],
    ['Испания', 'Spain', 'España'],
    ['Индия', 'India'],
    ['Китай', 'China'],
    ['Канада', 'Canada', 'Canadá'],
    ['Австралия', 'Australia'],
    ['Гонконг', 'Hong Kong'],
    ['Мексика', 'Mexico', 'México'],
    ['Бразилия', 'Brazil', 'Brasil'],
    ['Швеция', 'Sweden', 'Suecia'],
    ['Польша', 'Poland', 'Polonia'],
    ['Турция', 'Turkey', 'Turquía'],
    ['Иран', 'Iran'],
    ['Дания', 'Denmark', 'Dinamarca'],
    ['Нидерланды', 'Netherlands', 'Países Bajos'],
    ['Бельгия', 'Belgium', 'Bélgica'],
    ['Аргентина', 'Argentina'],
    ['Чехия', 'Czech Republic', 'Czechia', 'República Checa'],
    ['Тайвань', 'Taiwan'],
    ['Таиланд', 'Thailand', 'Tailandia'],
    ['Новая Зеландия', 'New Zealand', 'Nueva Zelanda'],
    ['Ирландия', 'Ireland', 'Irlanda'],
    ['Норвегия', 'Norway', 'Noruega'],
    ['Финляндия', 'Finland', 'Finlandia'],
    ['Австрия', 'Austria'],
    ['Швейцария', 'Switzerland', 'Suiza'],
    ['Израиль', 'Israel'],
    ['Украина', 'Ukraine', 'Ucrania'],
    ['Португалия', 'Portugal'],
    ['Греция', 'Greece', 'Grecia'],
    ['ЮАР', 'South Africa', 'Sudáfrica'],
    ['Сингапур', 'Singapore', 'Singapur'],
    ['Египет', 'Egypt', 'Egipto'],
];

function normalizeCountryKey(value: string): string {
    return value.trim().toLocaleLowerCase('ru').replace(/\s+/g, ' ');
}

function buildRankByCountryKey(): ReadonlyMap<string, number> {
    const rankByKey = new Map<string, number>();
    POPULAR_FILM_COUNTRY_GROUPS.forEach((names, rank) => {
        names.forEach((name) => {
            rankByKey.set(normalizeCountryKey(name), rank);
        });
    });
    return rankByKey;
}

const RANK_BY_COUNTRY_KEY = buildRankByCountryKey();

function readCountryRank(country: FilterOption): number {
    const candidates = [country.kpName, country.label, country.id];
    for (const candidate of candidates) {
        if (candidate === undefined || candidate === null || candidate === '') {
            continue;
        }
        const rank = RANK_BY_COUNTRY_KEY.get(normalizeCountryKey(String(candidate)));
        if (rank !== undefined) {
            return rank;
        }
    }
    return UNRANKED_COUNTRY_RANK;
}

type RankedCountry = {
    country: FilterOption;
    index: number;
    rank: number;
};

function compareCountries(left: RankedCountry, right: RankedCountry, locale: string): number {
    if (left.rank !== right.rank) {
        return left.rank - right.rank;
    }
    const byLabel = left.country.label.localeCompare(right.country.label, locale, { sensitivity: 'base' });
    if (byLabel !== 0) {
        return byLabel;
    }
    return left.index - right.index;
}

/** Puts major film-producing countries first. The rest stay alphabetical in the active locale. */
export function sortCountriesByFilmPopularity(countries: readonly FilterOption[], locale = 'ru'): FilterOption[] {
    return countries
        .map((country, index) => ({
            country,
            index,
            rank: readCountryRank(country),
        }))
        .sort((left, right) => compareCountries(left, right, locale))
        .map((item) => item.country);
}
