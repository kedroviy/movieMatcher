import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Swiper from 'react-native-deck-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import { SMControlBar } from './sm-control-bar';
import { SMSwipeCards } from './sm-swipe-cards';
import { OverlayLabel } from '../ui/overlay-label';
import { Color } from 'styles/colors';
import { AppDispatch } from 'redux/configure-store';
import { loadMovies, setPage } from 'redux/moviesSlice';
import { SimpleButton } from 'shared';
import { t } from 'i18next';
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

    const handleOnSwipedLeft = (cardIndex: any) => {
        console.log(`Свайп влево на карточке с индексом ${cardIndex}`);
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

        storageData[currentSessionLabel].movies.push(likedMovie);
        await AsyncStorage.setItem('@mymovies', JSON.stringify(storageData));
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
            ) : (
                <>
                    {!loading ? (
                        <>
                            <View style={styles.swiperClip}>
                                <Swiper
                                    key={`solo-deck-${currentSessionLabel ?? 'none'}-${currentPage}`}
                                    ref={useSwiper}
                                    animateCardOpacity
                                    containerStyle={styles.swiperContainer}
                                    cards={deckDocs}
                                    renderCard={(card) => <SMSwipeCards card={card} />}
                                    cardIndex={currentCardIndex}
                                    backgroundColor={Color.BACKGROUND_GREY}
                                    stackSize={2}
                                    stackSeparation={-20}
                                    horizontalSwipe
                                    verticalSwipe={false}
                                    showSecondCard
                                    animateOverlayLabelsOpacity
                                    onSwipedLeft={handleOnSwipedLeft}
                                    onSwipedRight={handleOnSwipedRight}
                                    onSwiped={handleOnSwiped}
                                    overlayLabels={{
                                        left: {
                                            title: 'NOPE',
                                            element: <OverlayLabel label="NOPE" color="#E5566D" />,
                                            style: {
                                                wrapper: styles.overlayWrapper,
                                            },
                                        },
                                        right: {
                                            title: 'LIKE',
                                            element: <OverlayLabel label="LIKE" color="#4CCC93" />,
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
                            </View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    swiperClip: {
        width,
        flex: 1,
        overflow: 'hidden',
    },
    swiperContainer: {
        flex: 1,
    },
    controlsBar: {
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
