import { CardStyleInterpolators } from "@react-navigation/stack";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SoloMatchScreen, UserProfileScreen, MatchScreen } from "pages";

import {
    AppRoutes,
    animationOptions,
    defaultOptions,
} from "./constants";
import { Color } from "styles/colors";
import { MatchSvgIcon, PlaySvgIcon, ProfileSvgIcon } from "shared";
import { useTranslation } from "react-i18next";

const Tabs = createBottomTabNavigator();

const screenOptions: BottomTabNavigationOptions = {
    tabBarInactiveTintColor: Color.GREY,
    tabBarActiveTintColor: Color.WHITE,
    tabBarStyle: {
        elevation: 0,
        backgroundColor: Color.GRAY_BROWN,
        height: 86,
        paddingBottom: 5,
    },
    headerShown: false,
};


export const TabNavigator = () => {
    const { t } = useTranslation();

    return (
        <Tabs.Navigator screenOptions={screenOptions}>
            <Tabs.Screen
                name={AppRoutes.SOLO_MATCH_SCREEN}
                component={SoloMatchScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MatchSvgIcon width={size} height={size} stroke={color} />
                    ),
                    tabBarLabel: t('tabs.selection'),
                    ...defaultOptions,
                    unmountOnBlur: true,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions,
                    key: AppRoutes.SOLO_MATCH_SCREEN
                }}

                key={AppRoutes.SOLO_MATCH_SCREEN}
            />
            <Tabs.Screen
                name={AppRoutes.MATCH_SCREEN}
                component={MatchScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <PlaySvgIcon width={size} height={size} stroke={color} />
                    ),
                    tabBarLabel: t('tabs.match'),
                    ...defaultOptions,
                    unmountOnBlur: true,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions,
                    key: AppRoutes.MATCH_SCREEN
                }}

                key={AppRoutes.SOLO_MATCH_SCREEN}
            />
            <Tabs.Screen
                name={AppRoutes.USER_PROFILE_SCREEN}
                component={UserProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <ProfileSvgIcon width={size} height={size} stroke={color} />
                    ),
                    tabBarLabel: t('tabs.profile'),
                    ...defaultOptions,
                    unmountOnBlur: true,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions,
                    key: AppRoutes.USER_PROFILE_SCREEN
                }}
                key={AppRoutes.USER_PROFILE_SCREEN}
            />
        </Tabs.Navigator>
    )
}