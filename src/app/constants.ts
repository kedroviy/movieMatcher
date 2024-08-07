import { StackNavigationOptions } from '@react-navigation/stack';
import { Movie } from 'features';
import { Color } from 'styles/colors';

export enum AppRoutes {
    TAB_NAVIGATOR = 'TabNavigator',
    SOLO_MATCH_SCREEN = 'SoloMatchScreen',
    LOGIN_NAVIGATOR = 'LoginNavigator',
    LOGIN_SCREEN = 'LoginScreen',
    MATCH_SCREEN = 'MatchScreen',
    LOGIN_REGISTRATION_SCREEN = 'LoginRegistration',
    LOGIN_AUTH_SCREEN = 'LoginAuth',
    LOGIN_ACC_RECOVERY_SCREEN = 'LoginAccRecovery',
    LOGIN_ACC_RECOVERY_CODE_SCREEN = 'LoginAccRecoveryCode',
    LOGIN_ACC_RECOVERY_NEW_PASSWORD = 'LoginAccRecoveryChangePassword',
    LOGIN_RESULT = 'LoginResult',
    ONBOARDING_SCREEN = 'OnboardingScreen',
    PROFILE_NAVIGATOR = 'ProfileNavigator',
    USER_PROFILE_SCREEN = 'UserProfileScreen',
    USER_PROFILE_ABOUT_SCREEN = 'UPAboutApplication',
    USER_PROFILE_LANGUAGE = 'UPLanguage',
    USER_PROFILE_ACC_SETTINGS = 'UPAccountSettings',
    USER_PROFILE_CHANGENAME = 'UPChangeName',
    PROFILE_RESULT = 'ProfileResult',
    SELF_SELECT_NAVIGATOR = 'SelfSelectNavigator',
    SM_CREATE_MOVIE_LIST_SCREEN = 'SMCreateMovieListFilter',
    SM_SELECTION_MOVIE = 'SMSelectionMovie',
    SM_MOVIE_FULL_LIST = 'SMMovieFullList',
    SM_MOVIE_DETAILS = 'SMMovieDetails',
    MATCH_NAVIGATOR = 'MatchNavigator',
    MATCH_LOBBY = 'MatchLobby',
    MATCH_JOIN_LOBBY = 'MatchJoinLobby',
    MATCH_SELECTION_MOVIE = 'MatchSelectionMovie',
    MATCH_RESULT = 'MatchResult',
};

export const defaultScreenOptions: StackNavigationOptions = {
    headerTitle: () => null,
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerShown: true,
    headerLeftContainerStyle: {
        paddingLeft: 16,
    },
    headerStyle: {
        backgroundColor: Color.BACKGROUND_GREY,
    },
    cardStyle: { backgroundColor: Color.BACKGROUND_GREY },
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
    SelfSelectNavigator: undefined;
    ProfileNavigator: undefined;
    MatchNavigator: undefined;
    SoloMatchScreen: undefined;
    LoginNavigator: undefined;
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
    UserProfileScreen: undefined;
    UPAboutApplication: undefined;
    UPLanguage: undefined;
    UPAccountSettings: undefined;
    UPChangeName: undefined;
    ProfileResult: {
        icon: JSX.Element;
        resultText: string;
        buttonText: string;
        buttonColor: string;
        onHandlePress: () => void;
    };
    SMCreateMovieListFilter: undefined;
    SMSelectionMovie: undefined;
    SMMovieFullList: { headerText: string };
    SMMovieDetails: { movie: Movie };
    MatchLobby: { lobbyName: string };
    MatchJoinLobby: undefined;
    MatchSelectionMovie: undefined;
    MatchResult: undefined;
};
