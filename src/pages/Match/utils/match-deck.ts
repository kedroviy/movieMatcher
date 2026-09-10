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
