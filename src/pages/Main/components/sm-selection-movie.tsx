import { FC, useCallback, useEffect, useRef, useState } from "react"
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Swiper from "react-native-deck-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SMControlBar } from "./sm-control-bar";
import { SMSwipeCards } from "./sm-swipe-cards";
import { OverlayLabel } from "../ui/overlay-label";
import { Color } from "styles/colors";
import { AppDispatch } from "redux/configure-store";
import { loadMovies, setPage } from "redux/moviesSlice";
import { Loader, SimpleButton } from "shared";

const { width } = Dimensions.get('window')

export const SMSelectionMovie: FC = () => {
    const { loading, data, currentSessionLabel, currentPage, currentFormData } = useSelector((state: any) => state.moviesSlice);
    const dispatch: AppDispatch = useDispatch();
    const [allCardsSwiped, setAllCardsSwiped] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const useSwiper = useRef<Swiper<any>>(null);

    useEffect(() => {


    }, [loading, data]);

    const handleOnSwipedLeft = (cardIndex: any) => {
        console.log(`Свайп влево на карточке с индексом ${cardIndex}`);
    };

    const handleOnSwipedRight = async (cardIndex: any) => {
        const likedMovie = data.docs[cardIndex];
        const storageDataJSON = await AsyncStorage.getItem('@mymovies');
        let storageData = storageDataJSON ? JSON.parse(storageDataJSON) : {};

        if (!storageData[currentSessionLabel]) {
            storageData[currentSessionLabel] = {
                id: currentSessionLabel,
                label: currentSessionLabel,
                link: 'https://api.kinopoisk.dev/v1.4/movie',
                movies: []
            };
        }

        storageData[currentSessionLabel].movies.push(likedMovie);
        await AsyncStorage.setItem('@mymovies', JSON.stringify(storageData));
        console.log('Movie liked and data updated');
    };

    const handleOnSwiped = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= data.docs.length) {
            setAllCardsSwiped(true);
        } else {
            setCurrentIndex(nextIndex);
        }
    };

    const handleLoadMore = useCallback(async () => {
        const nextPage = currentPage + 1;
        dispatch(setPage(nextPage));

        try {
            await dispatch(loadMovies({
                formData: currentFormData,
                sessionLabel: currentSessionLabel,
                page: nextPage
            }));
        } catch (error) {
            console.error('Error loading more movies:', error);
        }

        setAllCardsSwiped(false);
        setCurrentIndex(0);
    }, [currentPage, currentFormData, currentSessionLabel, dispatch, setAllCardsSwiped, setCurrentIndex]);

    return (
        <View style={styles.container}>
            {/* <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: width - 33,
                height: 48,
                marginTop: 10,
            }}
            >
                <Text style={styles.headerText}>{t('movieSelection')}</Text>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48
                    }}
                >
                    <FiltersSvgIcon width={24} height={24} />
                </TouchableOpacity>
            </View> */}
            {allCardsSwiped ? (
                <>
                    <Text style={{
                        fontSize: 22,
                        color: 'white',
                        marginTop: 20
                    }}>Пусто</Text>
                    <SimpleButton
                        title='Продолжить'
                        color={Color.BUTTON_RED}
                        titleColor={Color.WHITE}
                        buttonWidth={width - 32}
                        onHandlePress={handleLoadMore}
                    />
                </>

            ) : (
                <>
                    {!loading ? <><View style={{
                        width: width,
                        flex: 0.70,
                    }}>
                        <Swiper
                            ref={useSwiper}
                            animateCardOpacity
                            containerStyle={styles.swiperContainer}
                            cards={data.docs}
                            renderCard={card => <SMSwipeCards card={card} />}
                            cardIndex={0}
                            backgroundColor={Color.BACKGROUND_GREY}
                            stackSize={3}
                            stackSeparation={-25}
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
                            }} />
                    </View><View style={{
                        flex: 0.17,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        width: width / 2.2,
                        bottom: 20,
                    }}>
                            <SMControlBar
                                onHandleLike={() => useSwiper.current?.swipeRight()}
                                onHandleDislike={() => useSwiper.current?.swipeLeft()} />
                        </View></> : <Loader />}
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
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: Color.BLACK,
        opacity: 0.5
    }
});