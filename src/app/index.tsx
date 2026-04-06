import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView, StatusBar, View, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { AppNavigation } from './Navigation';
import { AppDispatch, RootState } from '../redux/configure-store';
import { initializeApp } from '../redux/authSlice';
import { LoginNavigator } from './LoginNavigator';
import { StartMessage } from 'shared';
import { Color } from 'styles/colors';
import useNetworkStatus from 'shared/hooks/useNetworkStatus';
import NetworkStatus from 'shared/ui/network-status';
import { useTranslation } from 'react-i18next';

export default function AppContainer() {
    const dispatch: AppDispatch = useDispatch();
    const { t } = useTranslation();
    const { isAuthenticated, loadingApplication, onboarded } = useSelector((state: RootState) => state.authSlice);
    const isDarkMode = useColorScheme() === 'light';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Color.BACKGROUND_GREY : Colors.lighter,
    };
    useNetworkStatus();

    useEffect(() => {
        dispatch(initializeApp());
    }, [dispatch]);

    if (loadingApplication) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.BACKGROUND_GREY }}>
                <StartMessage />
            </View>
        )
    }

    return (
        <NavigationContainer>
            <SafeAreaView
                style={[
                    backgroundStyle,
                    { flex: 1 }
                ]}
                testID="appContainer"
            >
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={Color.BACKGROUND_GREY}
                />
                {
                    !isAuthenticated ?
                        <LoginNavigator /> :
                        <AppNavigation onboarded={onboarded} />
                }

                <NetworkStatus status={t('general.network_problem')} />
            </SafeAreaView>
        </NavigationContainer>
    );
}
