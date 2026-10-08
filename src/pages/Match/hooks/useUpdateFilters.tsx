import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/configure-store';
import { updateRoomFiltersRedux } from 'redux/matchSlice';
import { ISMFormData } from 'pages/Main/sm.model';

export const useUpdateFilters = () => {
    const dispatch: AppDispatch = useDispatch();
    const { t } = useTranslation();

    const updateFilters = async (roomId: string, filters: ISMFormData) => {
        if (Object.keys(filters).length > 0) {
            await dispatch(updateRoomFiltersRedux({ roomId: roomId, filters: filters }))
                .unwrap()
                .then((response) => console.log('Update successful:', response))
                .catch((error) => {
                    console.error('Failed to update filters:', error);
                    Alert.alert(
                        t('prompts.error'),
                        typeof error === 'string' ? error : t('prompts.filters_update_failed'),
                    );
                });
        }
    };

    return updateFilters;
};
