import * as React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import {
  OnboardingScreen,
} from '@pages';
import {
  AppRoutes,
  RootStackParamList,
  animationOptions,
  defaultScreenOptions,
} from './constants';
import { TabNavigator } from './TabNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { SelfSelectNavigator } from './SelfSelectNavigator';
import { MatchNavigator } from './MatchNavigator';

const Stack = createStackNavigator<RootStackParamList>();

type AppNavigatorType = {
  onboarded: boolean;
}
export const AppNavigation: React.FC<AppNavigatorType> = ({ onboarded }) => {

  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
        {!onboarded ?
          <Stack.Screen
            name={AppRoutes.ONBOARDING_SCREEN}
            component={OnboardingScreen}
            options={{ headerShown: false }}
          /> :
          <>
            <Stack.Screen
              name={AppRoutes.TAB_NAVIGATOR}
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={AppRoutes.PROFILE_NAVIGATOR}
              component={ProfileNavigator}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                ...animationOptions
              }}
            />
            <Stack.Screen
              name={AppRoutes.MATCH_NAVIGATOR}
              component={MatchNavigator}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                ...animationOptions
              }}
            />
            <Stack.Screen
              name={AppRoutes.SELF_SELECT_NAVIGATOR}
              component={SelfSelectNavigator}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                ...animationOptions
              }}
            />
          </>
        }
    </Stack.Navigator>
  );
};
