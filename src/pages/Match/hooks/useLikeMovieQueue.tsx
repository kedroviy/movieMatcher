import { useDispatch } from 'react-redux';
import { MatchLikeFields } from 'features/match/match.model';
import { postLikeMovieRedux } from 'redux/matchSlice';
import { AppDispatch } from 'redux/configure-store';
import { useCallback, useRef, useState } from 'react';

/**
 * Serializes like HTTP calls per hook instance so `check-status` can await `waitForPendingLikes`
 * and the server sees every swipe-right before computing the common shortlist.
 */
export const useLikeMovieQueue = () => {
    const dispatch: AppDispatch = useDispatch();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const tailRef = useRef<Promise<void>>(Promise.resolve());

    const waitForPendingLikes = useCallback(() => tailRef.current, []);

    const likeMovie = useCallback(
        (likeData: MatchLikeFields) => {
            const next = tailRef.current
                .then(async () => {
                    setIsProcessing(true);
                    try {
                        await dispatch(postLikeMovieRedux(likeData)).unwrap();
                    } catch (error) {
                        console.error('Failed to like movie:', error);
                    } finally {
                        setIsProcessing(false);
                    }
                })
                .catch(() => undefined);
            tailRef.current = next;
            return next;
        },
        [dispatch],
    );

    return {
        likeMovie,
        waitForPendingLikes,
        isProcessing,
    };
};
