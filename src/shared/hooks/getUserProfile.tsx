import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from 'redux/appSlice';
import { AppDispatch } from 'redux/configure-store';
import { fetchUserProfile } from 'redux/userSlice';

const useFetchUserProfile = () => {
    const dispatch: AppDispatch = useDispatch();
    const { user, loading, error } = useSelector((state: any) => state.userSlice);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const resultAction = await dispatch(fetchUserProfile());
                if (fetchUserProfile.fulfilled.match(resultAction)) {
                    dispatch(addNotification({
                        message: 'Profile updated successfully!',
                        type: 'success',
                        id: Date.now(),
                    }));
                } else if (fetchUserProfile.rejected.match(resultAction)) {
                    dispatch(addNotification({
                        message: 'Failed to fetch profile.',
                        type: 'error',
                        id: Date.now(),
                    }));
                }
            } catch (error) {
                dispatch(addNotification({
                    message: 'An error occurred.',
                    type: 'error',
                    id: Date.now(),
                }));
            }
        };

        fetchProfile();
    }, [dispatch]);

    return { user, loading, error };
}

export default useFetchUserProfile;

