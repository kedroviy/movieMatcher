import i18n from './i18n';
import { useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';

import AppContainer from './src/app';
import { store } from './src/redux/configure-store';
import { queryClient } from './src/features/match/query-client';
import socketService from 'features/match/match-socketService';
import { API } from 'shared';
import { useInAppUpdate } from 'shared/hooks/useInAppUpdate';
import {
    applyUserLanguageLocally,
    getStoredUserLanguage,
    normalizeUserLanguage,
    USER_LANGUAGE_STORAGE_KEY,
} from 'shared/utils/user-language';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): React.JSX.Element {
    useInAppUpdate();

    useEffect(() => {
        const setLocalization = async () => {
            const stored = await AsyncStorage.getItem(USER_LANGUAGE_STORAGE_KEY);
            if (!stored) {
                const deviceCode = RNLocalize.getLocales()[0]?.languageCode;
                await applyUserLanguageLocally(normalizeUserLanguage(deviceCode));
                return;
            }
            const language = await getStoredUserLanguage();
            await i18n.changeLanguage(language);
        };
        void setLocalization();
        socketService.connect(API.BASE_URL);

        return () => {
            socketService.disconnect();
        };
    }, []);

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AppContainer />
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
