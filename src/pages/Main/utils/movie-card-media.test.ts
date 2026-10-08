import { resolveMoviePosterUri, resolveMovieRating, resolveMovieTitle } from './movie-card-media';

describe('movie-card-media', () => {
    it('falls back from previewUrl to url', () => {
        expect(resolveMoviePosterUri({ previewUrl: '', url: 'https://cdn.example/poster.jpg' })).toBe(
            'https://cdn.example/poster.jpg',
        );
    });

    it('uses alternativeName when name is empty', () => {
        expect(resolveMovieTitle({ name: '', alternativeName: 'Heat' })).toBe('Heat');
    });

    it('reads a missing rating as empty', () => {
        expect(resolveMovieRating({ rating: null })).toBeNull();
        expect(resolveMovieRating({ rating: { kp: null } })).toBeNull();
        expect(resolveMovieRating({ vote_average: 7.4 })).toBe(7.4);
        expect(resolveMovieRating({ rating: { kp: 8.1 } })).toBe(8.1);
    });
});
