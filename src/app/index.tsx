import 'react-native-gesture-handler';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView, StatusBar, View, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { AppNavigation } from './Navigation';
import { AppDispatch } from '../redux/configure-store';
import { initializeApp } from '../redux/authSlice';
import { LoginNavigator } from './LoginNavigator';
import { StartMessage } from 'shared';
import { Color } from 'styles/colors';

export default function AppContainer() {
    const dispatch: AppDispatch = useDispatch();
    const { isAuthenticated, loadingApplication, onboarded } = useSelector((state: any) => state.authSlice);
    const isDarkMode = useColorScheme() === 'light';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

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
                    backgroundColor="#353535"
                />
                {
                    !isAuthenticated ?
                        <LoginNavigator /> :
                        <AppNavigation onboarded={onboarded} />
                }
            </SafeAreaView>
        </NavigationContainer>
    );
}
