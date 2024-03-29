import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import {
  OnboardingScreen,
} from '@pages';
import {
  AppRoutes,
  RootStackParamList,
  defaultScreenOptions,
} from './constants';
import { TabNavigator } from './TabNavigator';
import { StartMessage } from 'shared';

const Stack = createStackNavigator<RootStackParamList>();

type NavigationTypes = {
  onboarded: string;
}

export const AppNavigation: React.FC<NavigationTypes> = ({ onboarded }) => {
  const { loadingApplication } = useSelector((state: any) => state.authSlice);

  if (loadingApplication) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <StartMessage />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Group>
        {onboarded ?
          <Stack.Screen
            name={AppRoutes.TAB_NAVIGATOR}
            component={TabNavigator}
            options={{ headerShown: false }}
          /> :
          <Stack.Screen
            name={AppRoutes.ONBOARDING_SCREEN}
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        }
      </Stack.Group>

    </Stack.Navigator>
  );
};
