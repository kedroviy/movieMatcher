import { resolveMoviePosterUri, resolveMovieTitle } from './movie-card-media';

describe('movie-card-media', () => {
    it('falls back from previewUrl to url', () => {
        expect(resolveMoviePosterUri({ previewUrl: '', url: 'https://cdn.example/poster.jpg' })).toBe(
            'https://cdn.example/poster.jpg',
        );
    });

    it('uses alternativeName when name is empty', () => {
        expect(resolveMovieTitle({ name: '', alternativeName: 'Heat' })).toBe('Heat');
    });
});
