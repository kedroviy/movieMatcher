import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, } from "react-redux";
import { useTranslation } from "react-i18next";

import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { AppDispatch } from "redux/configure-store";
import { MyMovieListComponent, withListOrEmptyState } from "./components/sm-hoc-component";
import { EmptyListComponent } from "./components/sm-empty-list";
import { Color } from "styles/colors";
import { SimpleButton } from "shared";
import { AppRoutes } from "app/constants";

const { width } = Dimensions.get('window')

const renderMovieCard = (movie: any) => (
    <Text key={movie.id}>{movie.title}</Text>
);

const MyListWithEmptyState = withListOrEmptyState(MyMovieListComponent);

export const SoloMatchScreen: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const { t } = useTranslation();
    const [moviesList, setMoviesList] = useState<any[]>([]);

    useEffect(() => {
        const fetchMoviesList = async () => {
            const listString = await AsyncStorage.getItem('my-movie_lists');
            const list = listString ? JSON.parse(listString) : null;
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
                alignItems: 'center',
                width: width - 33,
                height: 48,
                marginTop: 10,
            }}
            >
                <Text style={styles.headerText}>{t('selection_movie.my_movie_list')}</Text>
            </View>
            <MyListWithEmptyState
                data={moviesList || []}
                renderItem={renderMovieCard}
                EmptyListComponent={EmptyListComponent}
            />
            <SimpleButton
                color={Color.BUTTON_RED}
                titleColor={Color.WHITE}
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
