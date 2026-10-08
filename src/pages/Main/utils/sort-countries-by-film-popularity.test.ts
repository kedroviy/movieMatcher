import { FilterOption } from '../sm.model';
import { sortCountriesByFilmPopularity } from './sort-countries-by-film-popularity';

function country(kpName: string, label = kpName): FilterOption {
    return { id: kpName, label, kpName };
}

describe('sortCountriesByFilmPopularity', () => {
    it('keeps major film countries ahead of the rest', () => {
        const input = [
            country('Албания'),
            country('Япония'),
            country('Зимбабве'),
            country('США'),
            country('Корея Южная'),
            country('Франция'),
            country('Великобритания'),
            country('Германия'),
            country('Австрия'),
        ];

        const actual = sortCountriesByFilmPopularity(input, 'ru').map((item) => item.kpName);

        expect(actual.slice(0, 6)).toEqual(['США', 'Япония', 'Франция', 'Германия', 'Корея Южная', 'Великобритания']);
        expect(actual.slice(6)).toEqual(['Австрия', 'Албания', 'Зимбабве']);
    });

    it('ranks localized labels when kpName is missing', () => {
        const input: FilterOption[] = [
            { id: 'albania', label: 'Albania' },
            { id: 'japan', label: 'Japan' },
            { id: 'usa', label: 'USA' },
            { id: 'uk', label: 'United Kingdom' },
        ];

        const actual = sortCountriesByFilmPopularity(input, 'en').map((item) => item.label);

        expect(actual).toEqual(['USA', 'Japan', 'United Kingdom', 'Albania']);
    });

    it('does not treat historical German states as Germany', () => {
        const input = [country('Германия (ГДР)'), country('Германия'), country('Германия (ФРГ)')];

        const actual = sortCountriesByFilmPopularity(input, 'ru').map((item) => item.kpName);

        expect(actual[0]).toBe('Германия');
    });
});
