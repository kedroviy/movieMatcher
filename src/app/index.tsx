import 'react-native-gesture-handler';
import React, { useLayoutEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppNavigation } from './Navigation';
import { AppDispatch } from '../redux/configure-store';
import { checkAuthStatus } from '../redux/authSlice';
import { LoginNavigator } from './LoginNavigator';

export default function AppContainer() {
    const dispatch: AppDispatch = useDispatch();
    const [onboarded, setOnboarded] = useState<string>();
    const { isAuthenticated, loadingApplication } = useSelector((state: any) => state.authSlice);
    const isDarkMode = useColorScheme() === 'light';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    useLayoutEffect(() => {
        dispatch(checkAuthStatus());
        getStorage();
    }, [dispatch]);

    const getStorage = async () => {
        try {
            const value = await AsyncStorage.getItem('ONBOARDED');
            if (value !== null) {
                setOnboarded(value)
            }
        } catch (e) {
            return e
        }
    };

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
                    backgroundColor="#353535"
                />
                {
                    !isAuthenticated ?
                        <LoginNavigator /> :
                        <AppNavigation onboarded={onboarded as string} />
                }

            </SafeAreaView>
        </NavigationContainer>
    );
}
