const KINOPOISK_ORIGIN = 'https://www.kinopoisk.ru';
const TMDB_ORIGIN = 'https://www.themoviedb.org';

/** Opens the catalog page for the picked movie. Prefers the server `sourceUrl`. */
export function resolveMatchWatchUrl(movie: unknown): string | null {
    if (movie == null || typeof movie !== 'object') {
        return null;
    }
    const record = movie as {
        id?: unknown;
        isSeries?: unknown;
        provider?: unknown;
        sourceUrl?: unknown;
    };
    if (typeof record.sourceUrl === 'string' && record.sourceUrl.trim().length > 0) {
        return record.sourceUrl.trim();
    }
    const id = typeof record.id === 'number' ? record.id : Number(record.id);
    if (!Number.isFinite(id)) {
        return null;
    }
    if (record.provider === 'TMDB') {
        const kind = record.isSeries === true ? 'tv' : 'movie';
        return `${TMDB_ORIGIN}/${kind}/${id}`;
    }
    const kind = record.isSeries === true ? 'series' : 'film';
    return `${KINOPOISK_ORIGIN}/${kind}/${id}`;
}

/** Normalizes apisauce `/rooms/:key/get-movies` payload into a swipe deck. */

function readDocs(value: unknown, depth = 0): unknown[] | null {
    if (depth > 3 || value == null) {
        return null;
    }
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value !== 'object') {
        return null;
    }
    const record = value as Record<string, unknown>;
    if (Array.isArray(record.docs)) {
        return record.docs;
    }
    if ('data' in record) {
        return readDocs(record.data, depth + 1);
    }
    return null;
}

export function getMatchDeckDocs(movies: unknown): Record<string, unknown>[] {
    const docs = readDocs(movies);
    if (!docs) {
        return [];
    }
    return docs.filter(
        (card): card is Record<string, unknown> =>
            card != null && typeof card === 'object' && 'id' in card && (card as { id?: unknown }).id != null,
    );
}

export function getMatchDeckSignature(docs: ReadonlyArray<{ id?: unknown }>): string {
    if (!docs.length) {
        return 'empty';
    }
    return `${docs.length}:${String(docs[0]?.id)}:${String(docs[docs.length - 1]?.id)}`;
}

/** Room left the lobby and the swipe deck is the active screen. */
export function isSwipeMatchPhase(matchPhase: string | null | undefined): boolean {
    return matchPhase === 'SWIPING';
}

export function getMatchPhaseFromMoviesPayload(movies: unknown): string | undefined {
    if (movies == null || typeof movies !== 'object') {
        return undefined;
    }
    const data = 'data' in movies ? (movies as { data?: unknown }).data : movies;
    if (data == null || typeof data !== 'object') {
        return undefined;
    }
    const room = '_room' in data ? (data as { _room?: { matchPhase?: string } })._room : undefined;
    return room?.matchPhase;
}
