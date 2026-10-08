export type WaitingRoundSnapshot = {
    readonly waitingSinceVersion: number | null;
    readonly aggregateVersion: number | null;
    readonly matchPhase: string | null;
    readonly localUserStatus: string | null;
};

/**
 * The waiting screen is not "a socket event arrived". It ends when the room round moved:
 * a newer aggregate version, this user flipped back to ACTIVE, or the room reached a final pick.
 */
export function shouldLeaveWaitingRound(snapshot: WaitingRoundSnapshot): boolean {
    if (snapshot.matchPhase === 'FINAL_PICK') {
        return true;
    }
    if (
        snapshot.waitingSinceVersion != null &&
        snapshot.aggregateVersion != null &&
        snapshot.aggregateVersion > snapshot.waitingSinceVersion
    ) {
        return true;
    }
    return snapshot.localUserStatus === 'ACTIVE' && snapshot.matchPhase === 'SWIPING';
}

/**
 * A refetch that started before the round commit must not be treated as the new deck.
 * Missing versions only count when the room hint itself had no version.
 */
export function isDeckSnapshotCurrent(roomVersion: number | null, fetchedVersion: number | null): boolean {
    if (roomVersion == null) {
        return true;
    }
    if (fetchedVersion == null) {
        return false;
    }
    return fetchedVersion >= roomVersion;
}
