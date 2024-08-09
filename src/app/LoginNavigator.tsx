import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import {
    AppRoutes,
    RootStackParamList,
    animationOptions,
    defaultScreenOptions,
    withoutHeader,
} from "./constants";
import {
    LoginAccRecovery,
    LoginAccRecoveryChangePassword,
    LoginAccRecoveryCode,
    LoginAuth,
    LoginRegistration,
    LoginResult,
    LoginScreen,
} from "pages";

const Stack = createStackNavigator<RootStackParamList>();

export const LoginNavigator = () => (
    <Stack.Navigator screenOptions={defaultScreenOptions} >

        <Stack.Screen
            name={AppRoutes.LOGIN_SCREEN}
            component={LoginScreen}
            options={{
                ...withoutHeader,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                ...animationOptions
            }}
            key={AppRoutes.LOGIN_SCREEN}
        />
        <Stack.Screen
            name={AppRoutes.LOGIN_AUTH_SCREEN}
            component={LoginAuth}
            options={{
                headerStyle: {
                    backgroundColor: '#353535',
                },
                headerTintColor: '#F9F9F9',
                headerLeftContainerStyle: {
                    marginLeft: -3,
                    marginTop: 24,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                ...animationOptions
            }}
            key={AppRoutes.LOGIN_AUTH_SCREEN}
        />
        <Stack.Screen
            name={AppRoutes.LOGIN_REGISTRATION_SCREEN}
            component={LoginRegistration}
            options={{
                headerStyle: {
                    backgroundColor: '#353535',
                },
                headerTintColor: '#F9F9F9',
                headerLeftContainerStyle: {
                    marginLeft: -3,
                    marginTop: 24,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                ...animationOptions
            }}
            key={AppRoutes.LOGIN_REGISTRATION_SCREEN}
        />
        <Stack.Screen
            name={AppRoutes.LOGIN_ACC_RECOVERY_SCREEN}
            component={LoginAccRecovery}
            options={{
                headerStyle: {
                    backgroundColor: '#353535',
                },
                headerTintColor: '#F9F9F9',
                headerLeftContainerStyle: {
                    marginLeft: -3,
                    marginTop: 24,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                ...animationOptions
            }}
            key={AppRoutes.LOGIN_ACC_RECOVERY_SCREEN}
        />
        <Stack.Screen
            name={AppRoutes.LOGIN_ACC_RECOVERY_CODE_SCREEN}
            component={LoginAccRecoveryCode}
            options={{
                headerStyle: {
                    backgroundColor: '#353535',
                },
                headerTintColor: '#F9F9F9',
                headerLeftContainerStyle: {
                    marginLeft: -3,
                    marginTop: 24,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                ...animationOptions
            }}
            key={AppRoutes.LOGIN_ACC_RECOVERY_CODE_SCREEN}
        />
        <Stack.Screen
            name={AppRoutes.LOGIN_ACC_RECOVERY_NEW_PASSWORD}
            component={LoginAccRecoveryChangePassword}
            options={{
                headerStyle: {
                    backgroundColor: '#353535',
                },
                headerTintColor: '#F9F9F9',
                headerLeftContainerStyle: {
                    marginLeft: -3,
                    marginTop: 24,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                ...animationOptions
            }}
            key={AppRoutes.LOGIN_ACC_RECOVERY_NEW_PASSWORD}
        />

        <Stack.Screen
            name={AppRoutes.LOGIN_RESULT}
            component={LoginResult}
            options={{
                ...withoutHeader,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                ...animationOptions
            }}
            key={AppRoutes.LOGIN_RESULT}
        />

    </Stack.Navigator>
)