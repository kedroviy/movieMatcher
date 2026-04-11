/** apisauce payload for GET get-movies — `_room` comes from server aggregate. */
export function readDeckAggregateVersion(moviesPayload: unknown): number | undefined {
    const p = moviesPayload as { data?: { _room?: { aggregateVersion?: number } } } | undefined;
    return p?.data?._room?.aggregateVersion;
}

export function readStateAggregateVersion(stateResponse: unknown): number | undefined {
    const r = stateResponse as { data?: { aggregateVersion?: number } } | undefined;
    return r?.data?.aggregateVersion;
}

/** If deck snapshot version lags authoritative room state, log once (dev / metro). */
export function logDeckVersionMismatch(moviesPayload: unknown, stateResponse: unknown): void {
    const dv = readDeckAggregateVersion(moviesPayload);
    const sv = readStateAggregateVersion(stateResponse);
    if (dv == null || sv == null || dv === sv) {
        return;
    }
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn(
            `[match] Deck aggregateVersion (${dv}) differs from GET /rooms/.../state (${sv}) — refetch or investigate.`,
        );
    }
}
