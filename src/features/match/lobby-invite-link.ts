/** Custom-scheme deep link that React Navigation maps to `MatchLobby`. */
export const LOBBY_INVITE_SCHEME = 'moviematcher';
export const LOBBY_INVITE_PREFIX = `${LOBBY_INVITE_SCHEME}://`;

const pendingInviteRoomKeys = new Set<string>();

/**
 * Builds the in-app lobby URL (`moviematcher://lobby/:lobbyName`).
 * The path matches the navigation linking config, not the web `/join` route.
 */
export function buildLobbyInviteUrl(roomKey: string): string {
    const normalized = roomKey.trim();
    return `${LOBBY_INVITE_PREFIX}lobby/${encodeURIComponent(normalized)}`;
}

/** Reads a room key from a full invite URL or from the path React Navigation passes in. */
export function parseLobbyInviteRoomKey(value: string | null | undefined): string | null {
    if (!value?.trim()) {
        return null;
    }
    const withoutScheme = value.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
    const match = withoutScheme.match(/(?:^|\/)lobby\/([^/?#]+)/i);
    if (!match?.[1]) {
        return null;
    }
    try {
        const roomKey = decodeURIComponent(match[1]).trim();
        return roomKey.length > 0 ? roomKey : null;
    } catch {
        return null;
    }
}

/** Remembers that the next open of this lobby came from an invite link, so the screen can join. */
export function markLobbyOpenedFromInvite(roomKey: string): void {
    const normalized = roomKey.trim();
    if (!normalized) {
        return;
    }
    pendingInviteRoomKeys.add(normalized);
}

/** Returns true once per marked invite, then forgets it. */
export function consumeLobbyOpenedFromInvite(roomKey: string): boolean {
    return pendingInviteRoomKeys.delete(roomKey.trim());
}

export type LobbySharePayload = {
    title: string;
    message: string;
    url?: string;
};

/**
 * iOS share sheet reads `url` on its own. Android only shares `message`, so the deep link goes there.
 */
export function buildLobbySharePayload(input: {
    title: string;
    text: string;
    roomKey: string;
    includeUrlInMessage: boolean;
}): LobbySharePayload {
    const url = buildLobbyInviteUrl(input.roomKey);
    if (input.includeUrlInMessage) {
        return {
            title: input.title,
            message: `${input.text}\n${url}`,
        };
    }
    return {
        title: input.title,
        message: input.text,
        url,
    };
}

/** Share sheet dismissal is not a failure. */
export function isShareCancelled(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false;
    }
    const message = error.message.toLowerCase();
    return message.includes('did not share') || message.includes('cancel') || message.includes('dismiss');
}
