import { getMatchDeckDocs } from './match-deck';

describe('getMatchDeckDocs', () => {
    const movie = { id: 42, name: 'Heat', poster: { url: 'https://example.com/p.jpg' } };

    it('reads docs from an apisauce get-movies response', () => {
        expect(getMatchDeckDocs({ ok: true, data: { docs: [movie], total: 1 } })).toEqual([movie]);
    });

    it('reads a bare Kinopoisk payload', () => {
        expect(getMatchDeckDocs({ docs: [movie] })).toEqual([movie]);
    });
});
