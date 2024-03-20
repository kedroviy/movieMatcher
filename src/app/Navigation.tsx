import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

import {
  LoginAccRecovery,
  LoginAuth,
  LoginRegistration,
  LoginScreen,
  MainScreen,
  OnboardingScreen,
  UserProfileScreen,
} from '@pages';
import {
  AppRoutes,
  RootStackParamList,
  animationOptions,
  defaultScreenOptions,
  withoutHeader,
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

const Navigation: React.FC<NavigationTypes> = ({ onboarded }) => {
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
      {!isAuthenticated ?
        <Stack.Group>

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

        </Stack.Group> :
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

      }
    </Stack.Navigator>
  );
};

export { Navigation };
