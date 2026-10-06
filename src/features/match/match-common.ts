import type { CommonMovieRef, CommonUpdatedPayload, RoomStateCommons, RoomStateSnapshot } from './match.model';

/**
 * Normalize common movie refs from WS or room state.
 */
export function normalizeCommonMovies(
    movies: readonly CommonMovieRef[] | null | undefined,
): CommonMovieRef[] {
    if (!movies?.length) {
        return [];
    }
    return movies
        .map((movie) => ({
            id: Number(movie.id),
            title:
                typeof movie.title === 'string' && movie.title.trim()
                    ? movie.title.trim()
                    : `#${movie.id}`,
        }))
        .filter((movie) => Number.isFinite(movie.id));
}

/**
 * Badge label: `N / 4` in SET (target set), else plain `N`.
 */
export function formatCommonLabelCount(count: number, targetCount: number | null): string {
    if (targetCount != null && targetCount > 0) {
        return `${count} / ${targetCount}`;
    }
    return String(count);
}

/**
 * Unwrap apisauce `ApiResponse` body or pass-through if already a room state object.
 */
export function unwrapRoomStateSnapshot(response: unknown): RoomStateSnapshot | null {
    if (response == null || typeof response !== 'object') {
        return null;
    }
    const envelope = response as { data?: unknown };
    const candidate =
        envelope.data != null && typeof envelope.data === 'object' ? envelope.data : response;
    if (candidate == null || typeof candidate !== 'object') {
        return null;
    }
    const body = candidate as Record<string, unknown>;
    if (typeof body.roomKey !== 'string') {
        return null;
    }
    return body as RoomStateSnapshot;
}

export type CommonProgressState = {
    readonly commonCount: number;
    readonly commonMovies: readonly CommonMovieRef[];
    readonly commonTargetCount: number | null;
};

export function commonProgressFromRoomState(roomState: RoomStateCommons): CommonProgressState {
    const movies = normalizeCommonMovies(roomState.commonMovies);
    const count = roomState.commonCount ?? movies.length;
    const targetCount =
        roomState.commonTargetCount === undefined ? null : roomState.commonTargetCount;
    return {
        commonCount: count,
        commonMovies: movies,
        commonTargetCount: targetCount,
    };
}

export function commonProgressFromUpdated(message: CommonUpdatedPayload): CommonProgressState {
    return {
        commonCount: message.count,
        commonMovies: normalizeCommonMovies(message.movies),
        commonTargetCount: message.targetCount,
    };
}
