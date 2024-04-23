import React, { FC, useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { MyMovieListComponent, withListOrEmptyState } from "./components/sm-hoc-component";
import { EmptyListComponent } from "./components/sm-empty-list";
import { Color } from "styles/colors";
import { SimpleButton } from "shared";
import { AppRoutes } from "app/constants";
import { MoviesSavedType } from "features/selection-movies/selection-movies.model";
import { MovieCard } from "./ui/sm-movie-list-card";
import { AppDispatch } from "redux/configure-store";
import { fetchUserProfile } from "redux/userSlice";

const { width } = Dimensions.get('window');

const MyListWithEmptyState = withListOrEmptyState(MyMovieListComponent);

export const SoloMatchScreen: FC = () => {
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const dispatch: AppDispatch = useDispatch();
    const { user } = useSelector((state: any) => state.userSlice);
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [moviesList, setMoviesList] = useState<MoviesSavedType[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserProfile())
        }

        fetchMoviesList();

        return () => {
            setMoviesList([]);
        }
    }, [user]);

    const fetchMoviesList = async () => {
        setIsLoading(true);
        const listString = await AsyncStorage.getItem('@mymovies');
        if (listString) {
            const listObj: { [key: string]: MoviesSavedType } = JSON.parse(listString);
            let isModified = false;

            const updatedListObj: { [key: string]: MoviesSavedType } = Object.entries(listObj)
                .reduce<{ [key: string]: MoviesSavedType }>((acc, [key, session]) => {
                    if (session.movies.length > 0) {
                        acc[key] = session;
                    } else {
                        isModified = true;
                    }
                    return acc;
                }, {});

            if (isModified) {
                await AsyncStorage.setItem('@mymovies', JSON.stringify(updatedListObj));
            }

            setMoviesList(Object.values(updatedListObj));
        }
        setIsLoading(false);
        setIsRefreshing(false);
    };

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchMoviesList();
    }, []);

    const renderItem = ({ item }: { item: MoviesSavedType }) => (
        <MovieCard
            key={item.id}
            id={item.id}
            movies={item.movies}
            label={item.label}
            moviesCount={item.movies.length}
            onHandlePress={() => navigation.navigate(`${AppRoutes.SELF_SELECT_NAVIGATOR}`, {
                screen: `${AppRoutes.SM_MOVIE_FULL_LIST}`,
                params: { headerText: item.label },
            })}
        />
    );

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
            <View style={{
                flex: 1,
                bottom: 16,
            }}>
                {isLoading ?
                    <View style={styles.loader}>
                        <ActivityIndicator size='large' color={Color.BUTTON_RED} />
                    </View>
                    :
                    <FlatList
                        data={moviesList}
                        renderItem={renderItem}
                        keyExtractor={(item: any) => item.id}
                        ListEmptyComponent={EmptyListComponent}
                        contentContainerStyle={styles.contentContainer}
                        initialNumToRender={4}
                        getItemLayout={(data, index) => (
                            { length: 255, offset: 255 * index, index }
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                                colors={[Color.BUTTON_RED]}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    />}
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
        flexGrow: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 32,
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
    loader: {
        position: 'absolute',
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
