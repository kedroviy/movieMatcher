import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { MyMovieListComponent, withListOrEmptyState } from "./components/sm-hoc-component";
import { EmptyListComponent } from "./components/sm-empty-list";
import { Color } from "styles/colors";
import { SimpleButton } from "shared";
import { AppRoutes } from "app/constants";
import { MoviesSavedType } from "features/selection-movies/selection-movies.model";
import { MovieCard } from "./ui/sm-movie-list-card";

const { width } = Dimensions.get('window');

const MyListWithEmptyState = withListOrEmptyState(MyMovieListComponent);

export const SoloMatchScreen: FC = () => {
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const { t } = useTranslation();
    const [moviesList, setMoviesList] = useState<MoviesSavedType[]>([]);

    useEffect(() => {
        const fetchMoviesList = async () => {
            const listString = await AsyncStorage.getItem('@mymovies');
            const listObj = listString ? JSON.parse(listString) : {};
            const list: any = Object.values(listObj);
            setMoviesList(list);
        };

        fetchMoviesList();

    }, []);

    const onNavigate = () => navigation.navigate(
        AppRoutes.SELF_SELECT_NAVIGATOR, {
        screen: AppRoutes.SM_CREATE_MOVIE_LIST_SCREEN,
    });

    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: width - 33,
                height: 48,
                marginTop: 10,
            }}
            >
                <Text style={styles.headerText}>{t('selection_movie.my_movie_list')}</Text>
            </View>
            <View style={styles.contentContainer}>
                <ScrollView style={{ width: '100%', height: '100%' }}>
                    <MyListWithEmptyState
                        data={moviesList}
                        renderItem={({ id, label, movies }) => (
                            <MovieCard
                                key={id}
                                id={id}
                                movies={movies}
                                label={label}
                                moviesCount={movies.length}
                                onHandlePress={() => console.log("Clicked on Movie Card")}
                            />
                        )}
                        EmptyListComponent={EmptyListComponent}
                    />
                </ScrollView>
            </View>
            <SimpleButton
                color={Color.BUTTON_RED}
                titleColor={Color.WHITE}
                buttonWidth={width - 32}
                title={t('selection_movie.create_list_button')}
                onHandlePress={onNavigate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.BACKGROUND_GREY,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 32,
    },
    contentContainer: {
        flex: 0.9,
    },
    swiperContainer: {
        flex: 0.8,
    },
    buttonsContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: '15%',
    },
    overlayWrapper: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginTop: 30,
        marginLeft: -30,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28.8,
        color: Color.WHITE
    },
});
