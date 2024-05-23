// hooks/useUpdateFilters.js
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/configure-store';
import { updateRoomFiltersRedux } from 'redux/matchSlice';

export const useUpdateFilters = () => {
    const dispatch: AppDispatch = useDispatch();

    const updateFilters = async (roomId: string, filters: any) => {
        if (Object.keys(filters).length > 0) {
            await dispatch(updateRoomFiltersRedux({ roomId: roomId, filters: filters }))
                .unwrap()
                .then(response => console.log('Update successful:', response))
                .catch(error => {
                    console.error('Failed to update filters:', error);
                    Alert.alert("Error", typeof error === 'string' ? error : 'Failed to update filters due to an unexpected error');
                });
        }
    };

    return updateFilters;
};
