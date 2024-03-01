import 'react-native-gesture-handler';
import React, { useLayoutEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { Navigation } from './Navigation';
import { AppDispatch } from '../redux/configure-store';
import { checkAuthStatus } from '../redux/authSlice';

export default function AppContainer() {
    const dispatch: AppDispatch = useDispatch();
    const isDarkMode = useColorScheme() === 'light';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    useLayoutEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    return (
        <NavigationContainer>
            <SafeAreaView
                style={[
                    backgroundStyle,
                    { flex: 1 }
                ]}>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor="#353535"
                />
                <Navigation />
            </SafeAreaView>
        </NavigationContainer>
    );
}
