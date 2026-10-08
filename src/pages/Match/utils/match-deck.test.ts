import {
    getMatchDeckDocs,
    getMatchPhaseFromMoviesPayload,
    isSwipeMatchPhase,
    resolveMatchWatchUrl,
} from './match-deck';

describe('getMatchDeckDocs', () => {
    const movie = { id: 42, name: 'Heat', poster: { url: 'https://example.com/p.jpg' } };

    it('reads docs from an apisauce get-movies response', () => {
        expect(getMatchDeckDocs({ ok: true, data: { docs: [movie], total: 1 } })).toEqual([movie]);
    });

    it('reads a bare Kinopoisk payload', () => {
        expect(getMatchDeckDocs({ docs: [movie] })).toEqual([movie]);
    });
});

describe('resolveMatchWatchUrl', () => {
    it('prefers the server source url', () => {
        expect(
            resolveMatchWatchUrl({
                id: 550,
                provider: 'TMDB',
                sourceUrl: 'https://www.themoviedb.org/movie/550',
            }),
        ).toBe('https://www.themoviedb.org/movie/550');
    });

    it('builds a catalog url when source url is missing', () => {
        expect(resolveMatchWatchUrl({ id: 550, provider: 'TMDB' })).toBe('https://www.themoviedb.org/movie/550');
        expect(resolveMatchWatchUrl({ id: 123, isSeries: true })).toBe('https://www.kinopoisk.ru/series/123');
    });
});

describe('isSwipeMatchPhase', () => {
    it('is true only for the swiping phase', () => {
        expect(isSwipeMatchPhase('SWIPING')).toBe(true);
        expect(isSwipeMatchPhase('LOBBY')).toBe(false);
        expect(isSwipeMatchPhase(undefined)).toBe(false);
    });
});

describe('getMatchPhaseFromMoviesPayload', () => {
    it('reads match phase from the get-movies room meta', () => {
        expect(
            getMatchPhaseFromMoviesPayload({
                data: { docs: [], _room: { matchPhase: 'SWIPING' } },
            }),
        ).toBe('SWIPING');
    });
});
