import React, { FC, useCallback } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    RefreshControl,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { useMoviesList } from './hooks';
import { MyMovieListComponent, withListOrEmptyState } from "./components/sm-hoc-component";
import { EmptyListComponent } from "./components/sm-empty-list";
import { Color } from "styles/colors";
import { contentWidth, radius, screenPadding, spacing } from "styles/theme";
import { MovieLoader, SimpleButton } from "shared";
import { AppRoutes } from "app/constants";
import { MoviesSavedType } from "features/selection-movies/selection-movies.model";
import { MovieCard } from "./ui/sm-movie-list-card";

const MyListWithEmptyState = withListOrEmptyState(MyMovieListComponent);

export const SoloMatchScreen: FC = () => {
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const { t } = useTranslation();
    const { moviesList, isLoading, isRefreshing, setIsRefreshing, fetchMoviesList } = useMoviesList();

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
            <View style={styles.headerRow}>
                <Text style={styles.headerText}>{t('selection_movie.my_movie_list')}</Text>
            </View>
            <View style={styles.listWrap}>
                {isLoading ?
                    <View style={styles.loader}>
                        <MovieLoader />
                    </View>
                    :
                    <FlatList<MoviesSavedType>
                        data={moviesList}
                        renderItem={renderItem}
                        keyExtractor={(item: any) => item.id}
                        ListEmptyComponent={EmptyListComponent}
                        contentContainerStyle={styles.listContent}
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
                buttonWidth={contentWidth}
                title={t('selection_movie.create_list_button')}
                onHandlePress={onNavigate}
                buttonStyle={{ borderRadius: radius.lg }}
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
        paddingVertical: spacing.xl,
        paddingHorizontal: screenPadding,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        minHeight: 48,
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
    },
    listWrap: {
        flex: 1,
        alignSelf: 'stretch',
        marginBottom: spacing.md,
        justifyContent: 'flex-start',
    },
    listContent: {
        flexGrow: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
        width: contentWidth,
        paddingBottom: spacing.md,
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
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
