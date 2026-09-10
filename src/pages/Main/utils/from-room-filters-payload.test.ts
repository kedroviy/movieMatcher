import { fromRoomFiltersPayload } from './from-room-filters-payload';

describe('fromRoomFiltersPayload', () => {
    const sources = {
        genres: [{ id: 'komediya', label: 'Комедия', kpName: 'комедия' }],
        countries: [{ id: 'SShA', label: 'США', kpName: 'США' }],
        years: [
            {
                id: 'decade-2010',
                label: '2010',
                kpName: '2010-2019',
                children: [{ id: 2011, label: '2011', kpName: '2011' }],
            },
        ],
    };

    it('restores contract payload by id and kpName', () => {
        const actual = fromRoomFiltersPayload(
            {
                selectedCountries: [{ id: 'SShA', label: 'США', kpName: 'США' }],
                selectedGenres: [],
                excludeGenre: [],
                selectedYears: [{ id: 2011, label: '2011', kpName: '2011' }],
                selectedRating: [7, 10],
            },
            sources,
        );
        expect(actual.selectedCountries).toEqual([sources.countries[0]]);
        expect(actual.selectedYears).toEqual([sources.years[0].children?.[0]]);
        expect(actual.selectedRating).toEqual([7, 10]);
    });
});
