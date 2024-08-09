import { useDispatch } from 'react-redux';
import { MatchLikeFields } from 'features/match/match.model';
import { postLikeMovieRedux } from 'redux/matchSlice';
import { AppDispatch } from 'redux/configure-store';
import { useState } from 'react';

export const useLikeMovieQueue = () => {
    const dispatch: AppDispatch = useDispatch();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const likeMovie = async (likeData: MatchLikeFields) => {
        setIsProcessing(true);
        try {
            console.log('Dispatching like request:', likeData);
            await dispatch(postLikeMovieRedux(likeData)).unwrap();
        } catch (error) {
            console.error('Failed to like movie:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        likeMovie,
        isProcessing,
    };
};
