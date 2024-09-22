import i18n from './i18n';
import { useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import { Provider } from 'react-redux';

import AppContainer from './src/app';
import { store } from './src/redux/configure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketService from 'features/match/match-socketService';
import { API, StatusNotification } from 'shared';
import { useTranslation } from 'react-i18next';
import { useInAppUpdate } from 'shared/hooks/useInAppUpdate';

function App(): React.JSX.Element {
  const { t } = useTranslation();
  useInAppUpdate();
  
  useEffect(() => {
    const setLocalization = async () => {

      let currentLanguage = await AsyncStorage.getItem('language');

      if (!currentLanguage) {
        currentLanguage = RNLocalize.getLocales()[0].languageCode;
        i18n.changeLanguage(currentLanguage);
        await AsyncStorage.setItem('language', currentLanguage);
      }

      i18n.changeLanguage(currentLanguage);
    }
    setLocalization();
    socketService.connect(API.BASE_URL);

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <AppContainer />
      <StatusNotification />
    </Provider>);
}

export default App;
