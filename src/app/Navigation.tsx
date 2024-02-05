import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../pages/index';
import { AppRoutes, RootStackParamList, defaultScreenOptions, withoutHeader } from '../shared/index';

const Stack = createStackNavigator<RootStackParamList>();

const Navigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Group>
        <Stack.Screen
          name={AppRoutes.LOGIN_SCREEN}
          component={LoginScreen}
          options={{ ...withoutHeader }}
          key={AppRoutes.LOGIN_SCREEN}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export { Navigation };
