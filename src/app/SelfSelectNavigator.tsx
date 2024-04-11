import { FC } from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";

import {
    AppRoutes,
    animationOptions,
    defaultScreenOptions,
} from "./constants";
import { SMCreateMovieListFilter } from "pages";
import { Color } from "styles/colors";
import { SMSelectionMovie } from "pages/Main/components/sm-selection-movie";

const SelfSelectStack = createStackNavigator();

export const SelfSelectNavigator: FC = () => {
    const { t } = useTranslation();

    return (
        <SelfSelectStack.Navigator screenOptions={defaultScreenOptions}>
            <SelfSelectStack.Screen
                name={AppRoutes.SM_CREATE_MOVIE_LIST_SCREEN}
                component={SMCreateMovieListFilter}
                options={{
                    headerTitle: t('selection_movie.create_list_component.crc_header'),
                    headerStyle: {
                        backgroundColor: Color.BACKGROUND_GREY,
                    },
                    headerTitleStyle: {
                        marginTop: 24,
                    },
                    headerTintColor: Color.WHITE,
                    headerLeftContainerStyle: {
                        marginLeft: -3,
                        marginTop: 24,
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions
                }}
                key={AppRoutes.SM_CREATE_MOVIE_LIST_SCREEN}
            />
            <SelfSelectStack.Screen
                name={AppRoutes.SM_SELECTION_MOVIE}
                component={SMSelectionMovie}
                options={{
                    headerTitle: 'Подбор фильма',
                    headerStyle: {
                        backgroundColor: Color.BACKGROUND_GREY,
                    },
                    headerTitleStyle: {
                        marginTop: 24,
                    },
                    headerTintColor: Color.WHITE,
                    headerLeftContainerStyle: {
                        marginLeft: -3,
                        marginTop: 24,
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    ...animationOptions
                }}
                key={AppRoutes.SM_SELECTION_MOVIE}
            />


        </SelfSelectStack.Navigator>
    )
}
