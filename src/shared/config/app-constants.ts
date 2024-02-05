import { StackNavigationOptions } from '@react-navigation/stack';

export enum AppRoutes {
    HOME_SCREEN = 'HomeScreen',
    LOGIN_SCREEN = 'LoginScreen',
};

export const defaultScreenOptions: StackNavigationOptions = {
    headerTitle: () => null,
    headerTitleAlign: 'center',
    headerShadowVisible: false,

    cardOverlayEnabled: false,
};

export const withoutHeader: StackNavigationOptions = {
    headerShown: false,
};

export const withHeader: StackNavigationOptions = {
    headerShown: true,
};

export type RootStackParamList = {
    HomeScreen: undefined;
    LoginScreen: undefined;
};
