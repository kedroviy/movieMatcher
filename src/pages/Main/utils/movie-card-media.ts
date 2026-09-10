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
