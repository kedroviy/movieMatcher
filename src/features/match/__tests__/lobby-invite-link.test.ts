import {
    buildLobbyInviteUrl,
    buildLobbySharePayload,
    consumeLobbyOpenedFromInvite,
    isShareCancelled,
    markLobbyOpenedFromInvite,
    parseLobbyInviteRoomKey,
} from '../lobby-invite-link';

describe('lobby invite link', () => {
    it('builds a navigation deep link for the lobby screen', () => {
        expect(buildLobbyInviteUrl('123456')).toBe('moviematcher://lobby/123456');
    });

    it('encodes a room key that contains reserved characters', () => {
        expect(buildLobbyInviteUrl('ab cd')).toBe('moviematcher://lobby/ab%20cd');
    });

    it('reads the room key from a full url and from a navigation path', () => {
        expect(parseLobbyInviteRoomKey('moviematcher://lobby/123456')).toBe('123456');
        expect(parseLobbyInviteRoomKey('lobby/987654')).toBe('987654');
        expect(parseLobbyInviteRoomKey('/lobby/987654?invite=1')).toBe('987654');
        expect(parseLobbyInviteRoomKey('moviematcher://lobby/ab%20cd')).toBe('ab cd');
    });

    it('ignores urls that do not point at a lobby', () => {
        expect(parseLobbyInviteRoomKey('moviematcher://profile')).toBeNull();
        expect(parseLobbyInviteRoomKey('')).toBeNull();
        expect(parseLobbyInviteRoomKey(null)).toBeNull();
    });

    it('puts the deep link in the message on Android and in url on iOS', () => {
        const androidPayload = buildLobbySharePayload({
            title: 'Movie Match',
            text: 'Join me',
            roomKey: '123456',
            includeUrlInMessage: true,
        });
        const iosPayload = buildLobbySharePayload({
            title: 'Movie Match',
            text: 'Join me',
            roomKey: '123456',
            includeUrlInMessage: false,
        });

        expect(androidPayload.message).toBe('Join me\nmoviematcher://lobby/123456');
        expect(androidPayload.url).toBeUndefined();
        expect(iosPayload.message).toBe('Join me');
        expect(iosPayload.url).toBe('moviematcher://lobby/123456');
    });

    it('consumes an invite mark only once', () => {
        markLobbyOpenedFromInvite('123456');

        expect(consumeLobbyOpenedFromInvite('123456')).toBe(true);
        expect(consumeLobbyOpenedFromInvite('123456')).toBe(false);
    });

    it('treats a dismissed share sheet as cancellation', () => {
        expect(isShareCancelled(new Error('User did not share'))).toBe(true);
        expect(isShareCancelled(new Error('Network failed'))).toBe(false);
        expect(isShareCancelled('cancel')).toBe(false);
    });
});
