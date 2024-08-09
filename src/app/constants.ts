import { StackNavigationOptions } from '@react-navigation/stack';

export enum AppRoutes {
    TAB_NAVIGATOR = 'TabNavigator',
    SOLO_MATCH_SCREEN = 'SoloMatchScreen',
    LOGIN_SCREEN = 'LoginScreen',
    MATCH_SCREEN = 'MatchScreen',
    LOGIN_REGISTRATION_SCREEN = 'LoginRegistration',
    LOGIN_AUTH_SCREEN = 'LoginAuth',
    LOGIN_ACC_RECOVERY_SCREEN = 'LoginAccRecovery',
    LOGIN_ACC_RECOVERY_CODE_SCREEN = 'LoginAccRecoveryCode',
    LOGIN_ACC_RECOVERY_NEW_PASSWORD = 'LoginAccRecoveryChangePassword',
    LOGIN_RESULT = 'LoginResult',
    ONBOARDING_SCREEN = 'OnboardingScreen',
    USER_PROFILE_SCREEN = 'UserProfileScreen',
    PROFILE_NAVIGATOR = 'ProfileNavigator',
    USER_PROFILE_ABOUT_SCREEN = 'UPAboutApplication',
    USER_PROFILE_LANGUAGE = 'UPLanguage',
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

export const defaultOptions: any = {
    tabBarIconStyle: { bottom: '13%' },
    tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        fontFamily: 'Roboto',
        lineHeight: 14.4,
        bottom: '20%'
    },
}

export type RootStackParamList = {
    TabNavigator: undefined;
    SoloMatchScreen: undefined;
    LoginScreen: undefined;
    LoginAuth: undefined;
    MatchScreen: undefined;
    LoginRegistration: undefined;
    LoginAccRecovery: undefined;
    LoginAccRecoveryCode: undefined;
    LoginAccRecoveryChangePassword: undefined;
    LoginResult: {
        icon: string;
        resultText: string;
        buttonText: string;
        buttonColor: string;
        onHandlePress: () => void;
    };
    OnboardingScreen: undefined;
    ProfileNavigator: undefined;
    UserProfileScreen: undefined;
    UPAboutApplication: undefined;
    UPLanguage: undefined;
};
