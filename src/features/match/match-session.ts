import { CommonActions, NavigationProp, ParamListBase } from '@react-navigation/native';
import { QueryClient } from '@tanstack/react-query';
import { AppRoutes } from 'app/constants';
import { AppDispatch } from 'redux/configure-store';
import { resetMatchSession, resetMovies } from 'redux/matchSlice';
import { roomMoviesQueryKey, roomStateQueryKey } from './query-client';

type ClearMatchSessionOptions = {
    roomKey?: string;
};

/** Clears Redux match session and TanStack Query caches for one or all rooms. */
export function clearMatchSession(
    dispatch: AppDispatch,
    queryClient: QueryClient,
    { roomKey }: ClearMatchSessionOptions = {},
) {
    dispatch(resetMatchSession());
    if (roomKey) {
        queryClient.removeQueries({ queryKey: roomMoviesQueryKey(roomKey) });
        queryClient.removeQueries({ queryKey: roomStateQueryKey(roomKey) });
    } else {
        queryClient.removeQueries({ queryKey: ['roomMovies'] });
        queryClient.removeQueries({ queryKey: ['roomState'] });
    }
}

type OpenMatchLobbyOptions = {
    /** When false, keeps room/membership already written by createRoom or joinRoom. */
    clearRedux?: boolean;
};

/** Opens lobby with a fresh navigator target; optionally wipes stale match state first. */
export function openMatchLobby(
    navigation: NavigationProp<ParamListBase>,
    dispatch: AppDispatch,
    queryClient: QueryClient,
    lobbyName: string,
    { clearRedux = true }: OpenMatchLobbyOptions = {},
) {
    if (clearRedux) {
        clearMatchSession(dispatch, queryClient, { roomKey: lobbyName });
    } else {
        dispatch(resetMovies());
        queryClient.removeQueries({ queryKey: roomMoviesQueryKey(lobbyName) });
        queryClient.removeQueries({ queryKey: roomStateQueryKey(lobbyName) });
    }

    navigation.dispatch(
        CommonActions.navigate({
            name: AppRoutes.MATCH_NAVIGATOR,
            params: {
                screen: AppRoutes.MATCH_LOBBY,
                params: { lobbyName },
            },
        }),
    );
}
