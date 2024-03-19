import { StackNavigationOptions } from '@react-navigation/stack';

export enum AppRoutes {
    TAB_NAVIGATOR = 'TabNavigator',
    MAIN_SCREEN = 'MainScreen',
    LOGIN_SCREEN = 'LoginScreen',
    USER_PROFILE_SCREEN = 'UserProfileScreen',
    LOGIN_REGISTRATION_SCREEN = 'LoginRegistration',
    LOGIN_AUTH_SCREEN = 'LoginAuth',
    LOGIN_ACC_RECOVERY_SCREEN = 'LoginAccRecovery',
};

export const defaultScreenOptions: StackNavigationOptions = {
    headerTitle: () => null,
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerLeftContainerStyle: {
        paddingLeft: 16,
    },
    headerRightContainerStyle: {
        paddingRight: 16,
    },
    cardOverlayEnabled: true,
};

export const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

export const withoutHeader: StackNavigationOptions = {
    headerShown: false,
};

export const withHeader: StackNavigationOptions = {
    headerShown: true,
};

const animationConfig = {
    animation: 'spring',
    config: {
        stiffness: 1380,
        damping: 100,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.05,
        restSpeedThreshold: 0.05,
        useNativeDriver: true,
    },
};

export const animationOptions: any = {
    transitionSpec: {
        open: animationConfig,
        close: animationConfig,
    },
};

export type RootStackParamList = {
    TabNavigator: undefined;
    MainScreen: undefined;
    LoginScreen: undefined;
    LoginAuth: undefined;
    LoginRegistration: undefined;
    LoginAccRecovery: undefined;
    UserProfileScreen: undefined;
};
