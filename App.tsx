import i18n from './i18n';
import { useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import { Provider } from 'react-redux';
import AppContainer from './src/app';
import { store } from './src/redux/configure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): React.JSX.Element {

  useEffect(() => {
    const setLocalization = async () => {

      let currentLanguage = await AsyncStorage.getItem('currentLanguage');

      if (!currentLanguage) {
        currentLanguage = RNLocalize.getLocales()[0].languageCode;
        i18n.changeLanguage(currentLanguage);
        await AsyncStorage.setItem('currentLanguage', currentLanguage);
      }

      i18n.changeLanguage(currentLanguage);
    }
    setLocalization()
  }, []);

  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>);
}

export default App;
