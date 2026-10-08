import { type QueryClient, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMovieData, getRoomState } from 'features/match/match-service';
import { logDeckVersionMismatch, readDeckAggregateVersion } from './room-version-utils';
import { AppDispatch, store } from 'redux/configure-store';
import { roomMoviesQueryKey, roomStateQueryKey } from './query-client';
import { setMoviesPayload } from 'redux/matchSlice';

/** Per-room chain: parallel refetches were racing and the slower (stale) response could win in Redux. */
const refetchChains = new Map<string, Promise<void>>();

/**
 * Skip an older deck, and skip an unversioned payload once we already show a versioned one.
 * A late refetch without `_room.aggregateVersion` used to roll the waiting client back.
 */
export function shouldApplyMoviesPayload(incoming: unknown, current?: unknown): boolean {
    const nextVersion = readDeckAggregateVersion(incoming);
    const currentVersion = readDeckAggregateVersion(current);
    if (currentVersion == null) {
        return true;
    }
    if (nextVersion == null) {
        return false;
    }
    return nextVersion >= currentVersion;
}

export function dispatchMoviesIfNewer(dispatch: AppDispatch, incoming: unknown): boolean {
    const current = (store.getState() as { matchSlice: { movies: unknown } }).matchSlice.movies;
    if (!shouldApplyMoviesPayload(incoming, current)) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
            console.warn(
                `[match] Ignored stale deck (incoming v${readDeckAggregateVersion(incoming)} < current v${readDeckAggregateVersion(current)})`,
            );
        }
        return false;
    }
    dispatch(setMoviesPayload(incoming as any));
    return true;
}

async function refetchRoomMoviesToReduxInner(
    queryClient: QueryClient,
    dispatch: AppDispatch,
    roomKey: string,
): Promise<void> {
    await queryClient.invalidateQueries({ queryKey: roomStateQueryKey(roomKey) });

    const moviesResponse = await queryClient.fetchQuery({
        queryKey: roomMoviesQueryKey(roomKey),
        queryFn: () => getMovieData(roomKey),
        staleTime: 0,
    });

    if (moviesResponse) {
        dispatchMoviesIfNewer(dispatch, moviesResponse);
    }

    try {
        const stateResponse = await queryClient.fetchQuery({
            queryKey: roomStateQueryKey(roomKey),
            queryFn: () => getRoomState(roomKey),
            staleTime: 0,
        });
        logDeckVersionMismatch(moviesResponse, stateResponse);
    } catch {
        // state is optional for diagnostics
    }
}

/** Refetch deck from API and push the latest apisauce payload into Redux (after WS or manual refresh). */
export async function refetchRoomMoviesToRedux(
    queryClient: QueryClient,
    dispatch: AppDispatch,
    roomKey: string,
): Promise<void> {
    const previous = refetchChains.get(roomKey) ?? Promise.resolve();
    const current = previous.catch(() => undefined).then(() => refetchRoomMoviesToReduxInner(queryClient, dispatch, roomKey));
    refetchChains.set(roomKey, current);
    try {
        await current;
    } finally {
        if (refetchChains.get(roomKey) === current) {
            refetchChains.delete(roomKey);
        }
    }
}

/** Fetches room deck via TanStack Query and mirrors the result into Redux for existing UI. */
export function useRoomMoviesSync(roomKey: string | undefined) {
    const dispatch = useDispatch<AppDispatch>();

    const query = useQuery({
        queryKey: roomMoviesQueryKey(roomKey),
        queryFn: async () => {
            if (!roomKey) {
                throw new Error('roomKey required');
            }
            return getMovieData(roomKey);
        },
        enabled: Boolean(roomKey),
    });

    useEffect(() => {
        if (query.data) {
            dispatchMoviesIfNewer(dispatch, query.data);
        }
    }, [query.data, dispatch]);

    return query;
}

/** Subscribes to `GET /rooms/:key/state` for diagnostics and stale checks alongside the deck query. */
export function useRoomStateSync(roomKey: string | undefined) {
    return useQuery({
        queryKey: roomStateQueryKey(roomKey),
        queryFn: async () => {
            if (!roomKey) {
                throw new Error('roomKey required');
            }
            return getRoomState(roomKey);
        },
        enabled: Boolean(roomKey),
        staleTime: 15_000,
    });
}
