import { FC } from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";

import {
    AppRoutes,
    animationOptions,
    defaultScreenOptions,
} from "./constants";
import { UPAboutApplication, UPLanguage } from "pages";

const ProfileStack = createStackNavigator();

export const ProfileNavigator: FC = () => {
    const { t } = useTranslation();

    return (
        <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
            <ProfileStack.Screen
                name={AppRoutes.USER_PROFILE_ABOUT_SCREEN}
                component={UPAboutApplication}
                options={{
                    headerTitle: t('profile.about_application'),
                    headerStyle: {
                        backgroundColor: '#353535',
                    },
                    headerTitleStyle: {
                        marginTop: 24,
                    },
                    headerTintColor: '#F9F9F9',
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
                    headerStyle: {
                        backgroundColor: '#353535',
                    },
                    headerTitleStyle: {
                        marginTop: 24,
                    },
                    headerTintColor: '#F9F9F9',
                    headerLeftContainerStyle: {
                        marginLeft: -3,
                        marginTop: 24,
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions
                }}
                key={AppRoutes.USER_PROFILE_LANGUAGE}
            />
        </ProfileStack.Navigator>
    )
}
