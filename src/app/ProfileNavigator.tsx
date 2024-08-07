import { FC } from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";

import {
    AppRoutes,
    RootStackParamList,
    animationOptions,
    defaultScreenOptions,
    withoutHeader,
} from "./constants";
import { UPAboutApplication, UPAccountSettings, UPChangeName, UPLanguage, UserProfileResult } from "pages";
import { Color } from "styles/colors";

const ProfileStack = createStackNavigator<RootStackParamList>();

export const ProfileNavigator: FC = () => {
    const { t } = useTranslation();

    return (
        <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
            <ProfileStack.Screen
                name={AppRoutes.USER_PROFILE_ABOUT_SCREEN}
                component={UPAboutApplication}
                options={{
                    headerTitle: t('profile.about_application'),
                    headerTitleStyle: {
                        marginTop: 24,
                    },
                    headerStyle: {
                        backgroundColor: Color.BACKGROUND_GREY,
                    },
                    headerTintColor: Color.WHITE,
                    headerLeftContainerStyle: {
                        marginLeft: -3,
                        marginTop: 24,
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions
                }}
                key={AppRoutes.USER_PROFILE_ABOUT_SCREEN}
            />
            <ProfileStack.Screen
                name={AppRoutes.USER_PROFILE_LANGUAGE}
                component={UPLanguage}
                options={{
                    headerTitle: t('profile.language'),
                    headerTitleStyle: {
                        marginTop: 24,
                    },
                    headerStyle: {
                        backgroundColor: Color.BACKGROUND_GREY,
                    },
                    headerTintColor: Color.WHITE,
                    headerLeftContainerStyle: {
                        marginLeft: -3,
                        marginTop: 24,
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions
                }}
                key={AppRoutes.USER_PROFILE_LANGUAGE}
            />

            <ProfileStack.Screen
                name={AppRoutes.USER_PROFILE_ACC_SETTINGS}
                component={UPAccountSettings}
                options={{
                    headerTitle: t('profile.account_settings'),
                    headerTitleStyle: {
                        marginTop: 24,
                    },
                    headerStyle: {
                        backgroundColor: Color.BACKGROUND_GREY,
                    },
                    headerTintColor: Color.WHITE,
                    headerLeftContainerStyle: {
                        marginLeft: -3,
                        marginTop: 24,
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions
                }}
                key={AppRoutes.USER_PROFILE_ACC_SETTINGS}
            />

            <ProfileStack.Screen
                name={AppRoutes.USER_PROFILE_CHANGENAME}
                component={UPChangeName}
                options={{
                    headerTitle: t('acc_settings.changeName.change_name'),
                    headerTitleStyle: {
                        marginTop: 24,
                    },
                    headerTintColor: Color.WHITE,
                    headerLeftContainerStyle: {
                        marginLeft: -3,
                        marginTop: 24,
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions
                }}
                key={AppRoutes.USER_PROFILE_CHANGENAME}
            />

            <ProfileStack.Screen
                name={AppRoutes.PROFILE_RESULT}
                component={UserProfileResult}
                options={{
                    ...withoutHeader,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions
                }}
                key={AppRoutes.PROFILE_RESULT}
            />

        </ProfileStack.Navigator>
    )
}
