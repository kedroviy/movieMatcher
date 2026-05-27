/** Normalizes apisauce `/rooms/:key/get-movies` payload into a swipe deck. */
export function getMatchDeckDocs(movies: unknown): Record<string, unknown>[] {
    if (movies == null) {
        return [];
    }

    let payload: unknown = movies;
    if (typeof movies === 'object' && movies !== null && 'data' in movies) {
        payload = (movies as { data?: unknown }).data;
    }

    const docs =
        payload && typeof payload === 'object' && payload !== null && 'docs' in payload
            ? (payload as { docs?: unknown }).docs
            : undefined;

    if (!Array.isArray(docs)) {
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
