import { shouldApplyMoviesPayload } from '../use-room-movies-sync';
import { isDeckSnapshotCurrent, shouldLeaveWaitingRound } from '../waiting-round';

describe('shouldLeaveWaitingRound', () => {
    const waiting = {
        waitingSinceVersion: 4,
        aggregateVersion: 4,
        matchPhase: 'SWIPING',
        localUserStatus: 'WAITING',
    };

    it('stays while the room version and this user have not moved', () => {
        expect(shouldLeaveWaitingRound(waiting)).toBe(false);
    });

    it('leaves when the partner advanced the round', () => {
        expect(shouldLeaveWaitingRound({ ...waiting, aggregateVersion: 5 })).toBe(true);
    });

    it('leaves when the same deck restarted and this user is ACTIVE again', () => {
        expect(shouldLeaveWaitingRound({ ...waiting, localUserStatus: 'ACTIVE' })).toBe(true);
    });

    it('leaves on the final pick even if the version was missed', () => {
        expect(shouldLeaveWaitingRound({ ...waiting, matchPhase: 'FINAL_PICK', aggregateVersion: 4 })).toBe(true);
    });

    it('does not treat a missing baseline as an advance', () => {
        expect(
            shouldLeaveWaitingRound({
                ...waiting,
                waitingSinceVersion: null,
                aggregateVersion: 5,
                localUserStatus: 'WAITING',
            }),
        ).toBe(false);
    });
});

describe('isDeckSnapshotCurrent', () => {
    it('rejects a fetch that started before the committed version', () => {
        expect(isDeckSnapshotCurrent(6, 5)).toBe(false);
    });

    it('accepts a fetch at the committed version', () => {
        expect(isDeckSnapshotCurrent(6, 6)).toBe(true);
    });
});

describe('shouldApplyMoviesPayload', () => {
    const versioned = (version: number) => ({ data: { _room: { aggregateVersion: version } } });

    it('rejects an older snapshot', () => {
        expect(shouldApplyMoviesPayload(versioned(3), versioned(4))).toBe(false);
    });

    it('rejects an unversioned snapshot once a versioned deck is showing', () => {
        expect(shouldApplyMoviesPayload({ data: { docs: [] } }, versioned(4))).toBe(false);
    });

    it('accepts the first payload and a newer one', () => {
        expect(shouldApplyMoviesPayload(versioned(1), undefined)).toBe(true);
        expect(shouldApplyMoviesPayload(versioned(5), versioned(4))).toBe(true);
    });
});
