import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/configure-store';
import { doesUserHaveRoomRedux } from 'redux/matchSlice';

const useUserHasRoom = (userId: number) => {
    const dispatch: AppDispatch = useDispatch();
    const { roomKey, loading, error } = useSelector((state: RootState) => state.matchSlice);

    useEffect(() => {
        if (userId) {
            dispatch(doesUserHaveRoomRedux(userId));
        }
    }, [userId, dispatch]);

    return { roomKey, loading, error };
};

export default useUserHasRoom;