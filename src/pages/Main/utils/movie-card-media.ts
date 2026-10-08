function readTrimmedString(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

/** PoiskKino may send `previewUrl`, `url`, or an empty poster object. */
export function resolveMoviePosterUri(poster: unknown): string | null {
    if (poster == null || typeof poster !== 'object') {
        return null;
    }
    const record = poster as { previewUrl?: unknown; url?: unknown };
    const previewUrl = readTrimmedString(record.previewUrl);
    if (previewUrl) {
        return previewUrl;
    }
    return readTrimmedString(record.url);
}

/** Kinopoisk `rating.kp`, a bare number, or TMDB `vote_average`. */
export function resolveMovieRating(movie: unknown): number | null {
    if (movie == null || typeof movie !== 'object') {
        return null;
    }
    const record = movie as { rating?: unknown; vote_average?: unknown };
    const rating = record.rating;
    if (typeof rating === 'number' && Number.isFinite(rating)) {
        return rating;
    }
    if (rating != null && typeof rating === 'object' && 'kp' in rating) {
        const kp = (rating as { kp?: unknown }).kp;
        if (typeof kp === 'number' && Number.isFinite(kp)) {
            return kp;
        }
        if (typeof kp === 'string' && kp.trim() !== '') {
            const numeric = Number(kp);
            if (Number.isFinite(numeric)) {
                return numeric;
            }
        }
    }
    if (typeof record.vote_average === 'number' && Number.isFinite(record.vote_average)) {
        return record.vote_average;
    }
    return null;
}

export function resolveMovieTitle(movie: unknown): string {
    if (movie == null || typeof movie !== 'object') {
        return '—';
    }
    const record = movie as { name?: unknown; alternativeName?: unknown; enName?: unknown };
    return (
        readTrimmedString(record.name) ??
        readTrimmedString(record.alternativeName) ??
        readTrimmedString(record.enName) ??
        '—'
    );
}
