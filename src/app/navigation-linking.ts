import { getStateFromPath as getDefaultStateFromPath, LinkingOptions } from '@react-navigation/native';

import {
    LOBBY_INVITE_PREFIX,
    markLobbyOpenedFromInvite,
    parseLobbyInviteRoomKey,
} from 'features/match/lobby-invite-link';
import { AppRoutes, RootStackParamList } from './constants';

const linkingConfig = {
    screens: {
        [AppRoutes.MATCH_NAVIGATOR]: {
            screens: {
                [AppRoutes.MATCH_LOBBY]: 'lobby/:lobbyName',
            },
        },
    },
} as LinkingOptions<RootStackParamList>['config'];

/**
 * Maps `moviematcher://lobby/:lobbyName` onto the nested MatchLobby screen.
 * Web invites use `/join/:roomKey`; the app opens the screen through this scheme.
 */
export const navigationLinking: LinkingOptions<RootStackParamList> = {
    prefixes: [LOBBY_INVITE_PREFIX],
    config: linkingConfig,
    getStateFromPath(path, options) {
        const roomKey = parseLobbyInviteRoomKey(path);
        if (roomKey) {
            markLobbyOpenedFromInvite(roomKey);
        }
        return getDefaultStateFromPath(path, options);
    },
};
