import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import socketService from 'features/match/match-socketService';
import type { CommonMovieRef, CommonUpdatedPayload } from 'features/match/match.model';
import {
    commonProgressFromRoomState,
    commonProgressFromUpdated,
    formatCommonLabelCount,
    unwrapRoomStateSnapshot,
} from 'features/match/match-common';
import { useRoomStateSync } from 'features/match/use-room-movies-sync';

const FIRST_COMMON_TOAST_MS = 3200;

const EMPTY_MOVIES: readonly CommonMovieRef[] = [];

export type MatchCommonProgress = {
    readonly commonCount: number;
    readonly commonMovies: readonly CommonMovieRef[];
    readonly commonTargetCount: number | null;
    readonly commonLabelCount: string;
    readonly showFirstCommonToast: boolean;
};

/**
 * Live «Общих: N» — hydrate from room state, then apply WS `commonUpdated`.
 * Mirrors Angular MatchPlaySessionService commons handling.
 */
export function useMatchCommonProgress(roomKey: string | undefined): MatchCommonProgress {
    const roomStateQuery = useRoomStateSync(roomKey);
    const [commonCount, setCommonCount] = useState(0);
    const [commonMovies, setCommonMovies] = useState<readonly CommonMovieRef[]>(EMPTY_MOVIES);
    const [commonTargetCount, setCommonTargetCount] = useState<number | null>(null);
    const [showFirstCommonToast, setShowFirstCommonToast] = useState(false);
    const firstCommonToastShownRef = useRef(false);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const commonCountRef = useRef(0);

    const clearToastTimer = useCallback(() => {
        if (toastTimerRef.current != null) {
            clearTimeout(toastTimerRef.current);
            toastTimerRef.current = null;
        }
    }, []);

    const scheduleToastClear = useCallback(() => {
        clearToastTimer();
        toastTimerRef.current = setTimeout(() => {
            toastTimerRef.current = null;
            setShowFirstCommonToast(false);
        }, FIRST_COMMON_TOAST_MS);
    }, [clearToastTimer]);

    const applyProgress = useCallback(
        (count: number, movies: readonly CommonMovieRef[], targetCount: number | null) => {
            const previousCount = commonCountRef.current;
            const shouldToast =
                previousCount === 0 && count === 1 && !firstCommonToastShownRef.current;
            if (shouldToast) {
                firstCommonToastShownRef.current = true;
                setShowFirstCommonToast(true);
                scheduleToastClear();
            }
            commonCountRef.current = count;
            setCommonCount(count);
            setCommonMovies(movies);
            setCommonTargetCount(targetCount);
        },
        [scheduleToastClear],
    );

    useEffect(() => {
        firstCommonToastShownRef.current = false;
        commonCountRef.current = 0;
        setCommonCount(0);
        setCommonMovies(EMPTY_MOVIES);
        setCommonTargetCount(null);
        setShowFirstCommonToast(false);
        clearToastTimer();
    }, [roomKey, clearToastTimer]);

    useEffect(() => {
        const snapshot = unwrapRoomStateSnapshot(roomStateQuery.data);
        if (!snapshot) {
            return;
        }
        if (roomKey && snapshot.roomKey !== roomKey) {
            return;
        }
        const progress = commonProgressFromRoomState(snapshot);
        applyProgress(progress.commonCount, progress.commonMovies, progress.commonTargetCount);
    }, [roomStateQuery.data, roomKey, applyProgress]);

    useEffect(() => {
        if (!roomKey) {
            return;
        }
        const handler = (message: CommonUpdatedPayload) => {
            if (message.roomKey !== roomKey) {
                return;
            }
            const progress = commonProgressFromUpdated(message);
            applyProgress(progress.commonCount, progress.commonMovies, progress.commonTargetCount);
        };
        const unsubscribe = socketService.subscribeToCommonUpdated(handler);
        return () => {
            unsubscribe();
        };
    }, [roomKey, applyProgress]);

    useEffect(() => {
        return () => {
            clearToastTimer();
        };
    }, [clearToastTimer]);

    const commonLabelCount = useMemo(
        () => formatCommonLabelCount(commonCount, commonTargetCount),
        [commonCount, commonTargetCount],
    );

    return {
        commonCount,
        commonMovies,
        commonTargetCount,
        commonLabelCount,
        showFirstCommonToast,
    };
}
