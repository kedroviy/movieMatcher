import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Swiper from 'react-native-deck-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import { SMControlBar } from './sm-control-bar';
import { SMSwipeCards } from './sm-swipe-cards';
import { SwipeDeck } from './swipe-deck';
import { OverlayLabel } from '../ui/overlay-label';
import { Color } from 'styles/colors';
import { AppDispatch } from 'redux/configure-store';
import { loadMovies, setPage } from 'redux/moviesSlice';
import { SimpleButton } from 'shared';
import { useTranslation } from 'react-i18next';
import { MovieLoader } from 'shared/ui/movie-loader';
import { AppRoutes } from 'app/constants';
import { Movie, SMApiResponse } from 'features';

const { width } = Dimensions.get('window');

function getDeckDocs(data: SMApiResponse | []): Movie[] {
    if (!data || Array.isArray(data) || !Array.isArray(data.docs)) {
        return [];
    }
    return data.docs;
}

export const SMSelectionMovie: FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { loading, data, currentSessionLabel, currentPage, currentFormData } = useSelector(
        (state: any) => state.moviesSlice,
    );
    const deckDocs = getDeckDocs(data);
    const dispatch: AppDispatch = useDispatch();
    const [allCardsSwiped, setAllCardsSwiped] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const useSwiper = useRef<Swiper<any>>(null);

    useEffect(() => {}, [loading, data]);

    const handleOnSwipedLeft = (_cardIndex: number) => {
        return;
    };

    const handleOnSwipedRight = async (cardIndex: number) => {
        const likedMovie = deckDocs[cardIndex];
        if (!likedMovie) {
            return;
        }
        const storageDataJSON = await AsyncStorage.getItem('@mymovies');
        const storageData = storageDataJSON ? JSON.parse(storageDataJSON) : {};

        if (!storageData[currentSessionLabel]) {
            storageData[currentSessionLabel] = {
                id: currentSessionLabel,
                label: currentSessionLabel,
                link: 'https://api.poiskkino.dev/v1.4/movie',
                movies: [],
            };
        }

        const alreadySaved = storageData[currentSessionLabel].movies.some((m: Movie) => m.id === likedMovie.id);
        if (!alreadySaved) {
            storageData[currentSessionLabel].movies.push(likedMovie);
            await AsyncStorage.setItem('@mymovies', JSON.stringify(storageData));
        }
    };

    const handleOnSwiped = () => {
        setCurrentCardIndex((prev) => {
            const nextIndex = prev + 1;
            if (nextIndex >= deckDocs.length) {
                setAllCardsSwiped(true);
                return prev;
            }
            return nextIndex;
        });
    };

    const handleLoadMore = useCallback(async () => {
        const nextPage = currentPage + 1;
        dispatch(setPage(nextPage));

        try {
            await dispatch(
                loadMovies({
                    formData: currentFormData,
                    sessionLabel: currentSessionLabel,
                    page: nextPage,
                }),
            );
        } catch (error) {
            console.error('Error loading more movies:', error);
        }

        setAllCardsSwiped(false);
        setCurrentCardIndex(0);
    }, [currentPage, currentFormData, currentSessionLabel, dispatch]);

    const handleFinishSolo = useCallback(() => {
        navigation.navigate(AppRoutes.TAB_NAVIGATOR);
    }, [navigation]);

    return (
        <View style={styles.container}>
            {allCardsSwiped ? (
                <>
                    <Image source={require('../../../../assets/image53.png')} />
                    <Text
                        style={{
                            fontSize: 22,
                            color: 'white',
                            marginTop: 20,
                            textAlign: 'center',
                        }}
                    >
                        {t('selection_movie.selection_list_end')}
                    </Text>
                    <View style={styles.endActions}>
                        <SimpleButton
                            title={t('general.next_page')}
                            color={Color.BUTTON_RED}
                            titleColor={Color.WHITE}
                            buttonWidth={width - 32}
                            onHandlePress={handleLoadMore}
                        />
                        <SimpleButton
                            title={t('selection_movie.finish_solo_selection')}
                            color={Color.BACKGROUND_GREY}
                            titleColor={Color.WHITE}
                            buttonWidth={width - 32}
                            onHandlePress={handleFinishSolo}
                            buttonStyle={{
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: Color.WHITE,
                            }}
                        />
                    </View>
                </>
            ) : deckDocs.length === 0 ? (
                <View style={styles.loaderScreen}>
                    <MovieLoader />
                </View>
            ) : (
                <>
                    {!loading ? (
                        <>
                            <SwipeDeck
                                deckKey={`solo-deck-${currentSessionLabel ?? 'none'}-${currentPage}`}
                                cards={deckDocs}
                                swiperRef={useSwiper}
                                renderCard={(card) => <SMSwipeCards card={card} />}
                                onSwipedLeft={handleOnSwipedLeft}
                                onSwipedRight={handleOnSwipedRight}
                                onSwiped={handleOnSwiped}
                                overlayLabels={{
                                    left: {
                                        title: t('swipe.nope'),
                                        element: <OverlayLabel label={t('swipe.nope')} color="#E5566D" />,
                                        style: {
                                            wrapper: styles.overlayWrapper,
                                        },
                                    },
                                    right: {
                                        title: t('swipe.like'),
                                        element: <OverlayLabel label={t('swipe.like')} color="#4CCC93" />,
                                        style: {
                                            wrapper: {
                                                ...styles.overlayWrapper,
                                                alignItems: 'flex-start',
                                                marginLeft: 30,
                                            },
                                        },
                                    },
                                }}
                            />
                            <View style={styles.controlsBar}>
                                <SMControlBar
                                    onHandleLike={() => useSwiper.current?.swipeRight()}
                                    onHandleDislike={() => useSwiper.current?.swipeLeft()}
                                />
                            </View>
                        </>
                    ) : (
                        <MovieLoader />
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.BACKGROUND_GREY,
        flex: 1,
        alignSelf: 'stretch',
        width: '100%',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    loaderScreen: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.BACKGROUND_GREY,
    },
    controlsBar: {
        alignSelf: 'center',
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: width / 2.2,
        paddingVertical: 8,
        paddingBottom: 12,
        zIndex: 20,
        elevation: 20,
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
        color: Color.WHITE,
    },
    endActions: {
        gap: 16,
        width: '100%',
        alignItems: 'center',
        paddingBottom: 40,
        marginTop: 24,
    },
    loader: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: Color.BLACK,
        opacity: 0.5,
    },
});
