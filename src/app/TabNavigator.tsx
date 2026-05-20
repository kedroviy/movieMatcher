import { CardStyleInterpolators } from '@react-navigation/stack';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SoloMatchScreen, UserProfileScreen, MatchScreen } from 'pages';

import { AnimatedTabBar } from './AnimatedTabBar';
import { AppRoutes, animationOptions, defaultOptions } from './constants';
import { Color } from 'styles/colors';
import { MatchSvgIcon, PlaySvgIcon, ProfileSvgIcon } from 'shared';
import { useTranslation } from 'react-i18next';

const Tabs = createBottomTabNavigator();

const ACTIVE_STROKE = 2.5;
const INACTIVE_STROKE = 1.75;

const screenOptions: BottomTabNavigationOptions = {
    tabBarShowLabel: false,
    headerShown: false,
};

export const TabNavigator = () => {
    const { t } = useTranslation();

    return (
        <Tabs.Navigator screenOptions={screenOptions} tabBar={props => <AnimatedTabBar {...props} />}>
            <Tabs.Screen
                name={AppRoutes.SOLO_MATCH_SCREEN}
                component={SoloMatchScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <MatchSvgIcon
                            width={size}
                            height={size}
                            stroke={color}
                            strokeWidth={focused ? ACTIVE_STROKE : INACTIVE_STROKE}
                        />
                    ),
                    tabBarLabel: t('tabs.selection'),
                    ...defaultOptions,
                    unmountOnBlur: true,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions,
                }}
                key={AppRoutes.SOLO_MATCH_SCREEN}
            />
            <Tabs.Screen
                name={AppRoutes.MATCH_SCREEN}
                component={MatchScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <PlaySvgIcon
                            width={size}
                            height={size}
                            stroke={color}
                            strokeWidth={focused ? ACTIVE_STROKE : INACTIVE_STROKE}
                        />
                    ),
                    tabBarLabel: t('tabs.match'),
                    ...defaultOptions,
                    unmountOnBlur: true,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions,
                }}
                key={AppRoutes.MATCH_SCREEN}
            />
            <Tabs.Screen
                name={AppRoutes.USER_PROFILE_SCREEN}
                component={UserProfileScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <ProfileSvgIcon
                            width={size}
                            height={size}
                            stroke={color}
                            strokeWidth={focused ? ACTIVE_STROKE : INACTIVE_STROKE}
                        />
                    ),
                    tabBarLabel: t('tabs.profile'),
                    ...defaultOptions,
                    unmountOnBlur: true,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions,
                }}
                key={AppRoutes.USER_PROFILE_SCREEN}
            />
        </Tabs.Navigator>
    );
};
