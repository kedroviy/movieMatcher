import { type QueryClient, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMovieData, getRoomState } from 'features/match/match-service';
import { logDeckVersionMismatch } from './room-version-utils';
import { AppDispatch } from 'redux/configure-store';
import { roomMoviesQueryKey, roomStateQueryKey } from './query-client';
import { setMoviesPayload } from 'redux/matchSlice';

/** Refetch deck from API and push the latest apisauce payload into Redux (after WS or manual refresh). */
export async function refetchRoomMoviesToRedux(
    queryClient: QueryClient,
    dispatch: AppDispatch,
    roomKey: string,
): Promise<void> {
    await queryClient.refetchQueries({ queryKey: roomMoviesQueryKey(roomKey) });
    const fresh = queryClient.getQueryData(roomMoviesQueryKey(roomKey));
    if (fresh) {
        dispatch(setMoviesPayload(fresh as any));
    }
    try {
        await queryClient.fetchQuery({
            queryKey: roomStateQueryKey(roomKey),
            queryFn: () => getRoomState(roomKey),
        });
        const stateSnap = queryClient.getQueryData(roomStateQueryKey(roomKey));
        logDeckVersionMismatch(fresh as any, stateSnap);
    } catch {
        // state is optional for diagnostics
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
            dispatch(setMoviesPayload(query.data));
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
