import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux/configure-store';
import { fetchUserProfile } from 'redux/userSlice';

const useFetchUserProfile = () => {
    const dispatch: AppDispatch = useDispatch();
    const { user, loading, error } = useSelector((state: any) => state.userSlice);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    return { user, loading, error };
}

export default useFetchUserProfile;

