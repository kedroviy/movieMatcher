import { FC, useEffect } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { RouteProp } from '@react-navigation/native';

import { AppRoutes, RootStackParamList, animationOptions, defaultScreenOptions } from './constants';
import { resolveFiltersLocale } from 'features/filters/filters.model';
import { MatchJoinLobby, MatchLobby, MatchResult, MatchSelectionMovie } from 'pages';
import { prefetchKpGenres } from 'pages/Main/hooks/use-kp-genres-ru';
import { Color } from 'styles/colors';

const MatchStack = createStackNavigator<RootStackParamList>();

export const MatchNavigator: FC = () => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        prefetchKpGenres(resolveFiltersLocale(i18n.language));
    }, [i18n.language]);

    return (
        <MatchStack.Navigator screenOptions={defaultScreenOptions}>
            <MatchStack.Screen
                name={AppRoutes.MATCH_LOBBY}
                component={MatchLobby}
                getId={({ params }) => params.lobbyName}
                options={({ route }: { route: RouteProp<RootStackParamList, 'MatchLobby'> }) => ({
                    headerTitle: `Lobby #${route.params.lobbyName}`,
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
                    ...animationOptions,
                })}
                key={AppRoutes.MATCH_LOBBY}
            />

            <MatchStack.Screen
                name={AppRoutes.MATCH_JOIN_LOBBY}
                component={MatchJoinLobby}
                options={{
                    headerTitle: t('match_movie.main_match_screen.join_lobby_btn'),
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
                    ...animationOptions,
                }}
                key={AppRoutes.MATCH_JOIN_LOBBY}
            />

            <MatchStack.Screen
                name={AppRoutes.MATCH_SELECTION_MOVIE}
                component={MatchSelectionMovie}
                getId={({ params }) => params.roomKey ?? 'selection'}
                options={{
                    headerTitle: t('selection_movie.movie_selection'),
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
                    ...animationOptions,
                }}
                key={AppRoutes.MATCH_SELECTION_MOVIE}
            />
            <MatchStack.Screen
                name={AppRoutes.MATCH_RESULT}
                component={MatchResult}
                options={{
                    headerTitle: t('match_movie.match_result'),
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
                    ...animationOptions,
                }}
                key={AppRoutes.MATCH_RESULT}
            />
        </MatchStack.Navigator>
    );
};
