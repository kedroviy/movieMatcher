import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { Linking } from 'react-native';

import { markLobbyOpenedFromInvite, parseLobbyInviteRoomKey } from 'features/match/lobby-invite-link';
import { AppRoutes, RootStackParamList } from './constants';

const PENDING_LOBBY_INVITE_STORAGE_KEY = 'mm_pending_lobby_invite';

async function savePendingLobbyInvite(roomKey: string): Promise<void> {
    await AsyncStorage.setItem(PENDING_LOBBY_INVITE_STORAGE_KEY, roomKey);
}

async function consumePendingLobbyInvite(): Promise<string | null> {
    const stored = await AsyncStorage.getItem(PENDING_LOBBY_INVITE_STORAGE_KEY);
    if (!stored?.trim()) {
        return null;
    }
    await AsyncStorage.removeItem(PENDING_LOBBY_INVITE_STORAGE_KEY);
    return stored.trim();
}

function openLobbyFromInvite(
    navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
    roomKey: string,
): void {
    markLobbyOpenedFromInvite(roomKey);
    navigationRef.dispatch(
        CommonActions.navigate({
            name: AppRoutes.MATCH_NAVIGATOR,
            params: {
                screen: AppRoutes.MATCH_LOBBY,
                params: { lobbyName: roomKey },
            },
        }),
    );
}

/**
 * Keeps an invite link that arrives before login or onboarding, then opens the lobby screen.
 * While the match stack is mounted, `navigationLinking` handles the URL itself.
 */
export function usePendingLobbyInvite(
    navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
    canOpenLobby: boolean,
    isNavigationReady: boolean,
): void {
    useEffect(() => {
        if (canOpenLobby) {
            return;
        }
        const persistInvite = (url: string | null): void => {
            const roomKey = parseLobbyInviteRoomKey(url);
            if (!roomKey) {
                return;
            }
            void savePendingLobbyInvite(roomKey);
        };
        void Linking.getInitialURL().then(persistInvite);
        const subscription = Linking.addEventListener('url', (event) => {
            persistInvite(event.url);
        });
        return () => {
            subscription.remove();
        };
    }, [canOpenLobby]);

    useEffect(() => {
        if (!canOpenLobby || !isNavigationReady) {
            return;
        }
        let cancelled = false;
        void consumePendingLobbyInvite().then((roomKey) => {
            if (!roomKey) {
                return;
            }
            if (cancelled || !navigationRef.isReady()) {
                void savePendingLobbyInvite(roomKey);
                return;
            }
            openLobbyFromInvite(navigationRef, roomKey);
        });
        return () => {
            cancelled = true;
        };
    }, [canOpenLobby, isNavigationReady, navigationRef]);
}
