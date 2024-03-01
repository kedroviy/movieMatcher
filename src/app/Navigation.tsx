import * as React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { LoginAuth, LoginScreen, MainScreen } from '../pages/index';

import {
  AppRoutes,
  RootStackParamList,
  animationOptions,
  defaultScreenOptions,
  withoutHeader,
} from './constants';
import { useSelector } from 'react-redux';

import StartLogotype from '../../assets/startLogo.svg'

const Stack = createStackNavigator<RootStackParamList>();

const Navigation: React.FC = () => {
  const { isAuthenticated, loadingApplication } = useSelector((state: any) => state.authSlice);

  if(loadingApplication) {
    return(
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <StartLogotype/>
        <Text>Loading...</Text>
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
              ...withoutHeader,
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              ...animationOptions
            }}
            key={AppRoutes.LOGIN_AUTH_SCREEN}
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
