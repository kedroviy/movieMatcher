import {
    commonProgressFromRoomState,
    commonProgressFromUpdated,
    formatCommonLabelCount,
    normalizeCommonMovies,
    unwrapRoomStateSnapshot,
} from '../match-common';
import type { CommonUpdatedPayload } from '../match.model';

describe('match-common', () => {
    it('normalizes titles and drops non-finite ids', () => {
        const actual = normalizeCommonMovies([
            { id: 1, title: '  Arrival  ' },
            { id: 2, title: '' },
            { id: Number.NaN, title: 'Bad' },
        ]);
        expect(actual).toEqual([
            { id: 1, title: 'Arrival' },
            { id: 2, title: '#2' },
        ]);
    });

    it('formats SET badge as N / target', () => {
        expect(formatCommonLabelCount(2, 4)).toBe('2 / 4');
        expect(formatCommonLabelCount(3, null)).toBe('3');
    });

    it('unwraps apisauce room state envelope', () => {
        const actual = unwrapRoomStateSnapshot({
            ok: true,
            data: {
                roomKey: 'abc',
                commonCount: 1,
                commonMovies: [{ id: 10, title: 'Dune' }],
                commonTargetCount: 4,
            },
        });
        expect(actual?.roomKey).toBe('abc');
        expect(actual?.commonCount).toBe(1);
    });

    it('maps room state and WS payloads to progress', () => {
        const fromState = commonProgressFromRoomState({
            commonCount: 2,
            commonMovies: [{ id: 1, title: 'A' }],
            commonTargetCount: 4,
        });
        expect(fromState.commonCount).toBe(2);
        expect(fromState.commonTargetCount).toBe(4);

        const message: CommonUpdatedPayload = {
            roomKey: 'r1',
            matchPhase: 'SET',
            roomStatus: 'ACTIVE',
            count: 1,
            movies: [{ id: 9, title: 'B' }],
            targetCount: null,
        };
        const fromWs = commonProgressFromUpdated(message);
        expect(fromWs.commonCount).toBe(1);
        expect(fromWs.commonTargetCount).toBeNull();
        expect(fromWs.commonMovies[0]?.title).toBe('B');
    });
});
