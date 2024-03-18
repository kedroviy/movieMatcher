import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

import { LoginAccRecovery, LoginAuth, LoginRegistration, LoginScreen, MainScreen } from '@pages';
import {
  AppRoutes,
  RootStackParamList,
  animationOptions,
  defaultScreenOptions,
  withoutHeader,
} from './constants';

import StartLogotype from '../../assets/startLogo.svg'

const Stack = createStackNavigator<RootStackParamList>();
// const Tab = createBottomTabNavigator();

// const BottomTabNavigation() {
//   return (
//     <Tab.Navigator>

//     </Tab.Navigator>
//   );
// }

const Navigation: React.FC = () => {
  const { isAuthenticated, loadingApplication } = useSelector((state: any) => state.authSlice);

  if (loadingApplication) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <StartLogotype />
        <Text>Loading...</Text>
      </View>
    )
  }
  function alert(arg0: string): void {
    throw new Error('Function not implemented.');
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
              },
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              ...animationOptions
            }}
            key={AppRoutes.LOGIN_REGISTRATION_SCREEN}
          />
          <Stack.Screen
            name={AppRoutes.LOGIN_ACC_RECOVERY}
            component={LoginAccRecovery}
            options={{
              headerStyle: {
                backgroundColor: '#353535',
              },
              headerTintColor: '#F9F9F9',
              headerLeftContainerStyle: {
                marginLeft: -3,
              },
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              ...animationOptions
            }}
            key={AppRoutes.LOGIN_ACC_RECOVERY}
          />

        </Stack.Group> :
        <Stack.Group>

          <Stack.Screen
            name={AppRoutes.MAIN_SCREEN}
            component={MainScreen}
            options={{ ...withoutHeader }}
            key={AppRoutes.MAIN_SCREEN}
          />

        </Stack.Group>

      }
    </Stack.Navigator>
  );
};

export { Navigation };
