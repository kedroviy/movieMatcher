import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

import {
  MainScreen,
  OnboardingScreen,
  UserProfileScreen,
} from '@pages';
import {
  AppRoutes,
  RootStackParamList,
  animationOptions,
  defaultScreenOptions,
} from './constants';
import { StartMessage } from 'shared';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const screenOptions: BottomTabNavigationOptions = {
  tabBarInactiveTintColor: '#FFF',
  tabBarActiveTintColor: 'orange',
  tabBarStyle: {
    elevation: 1,
    backgroundColor: '#4D4C4D',
  },
  headerShown: false,
};

type NavigationTypes = {
  onboarded: string;
}

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={AppRoutes.MAIN_SCREEN}
        component={MainScreen}
        options={{
          tabBarLabel: 'Home',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          ...animationOptions
        }}

        key={AppRoutes.MAIN_SCREEN}
      />
      <Tab.Screen
        name={AppRoutes.USER_PROFILE_SCREEN}
        options={{
          tabBarLabel: 'Profile',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          ...animationOptions
        }}
        component={UserProfileScreen}
        key={AppRoutes.USER_PROFILE_SCREEN}
      />
    </Tab.Navigator>
  );
}

export const AppNavigation: React.FC<NavigationTypes> = ({ onboarded }) => {
  const { isAuthenticated, loadingApplication } = useSelector((state: any) => state.authSlice);

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
              component={BottomTabNavigation}
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
