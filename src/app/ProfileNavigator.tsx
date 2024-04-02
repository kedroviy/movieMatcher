import { FC } from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";

import {
    AppRoutes,
    animationOptions,
    defaultScreenOptions,
} from "./constants";
import { UPAboutApplication } from "pages";

const ProfileStack = createStackNavigator();

export const ProfileNavigator: FC = () => {
    // const t = useTranslate();
    return (
        <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
            <ProfileStack.Screen
                name={AppRoutes.USER_PROFILE_ABOUT_SCREEN}
                component={UPAboutApplication}
                options={{
                    headerTitle: "О приложении",
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
        </ProfileStack.Navigator>
    )
}