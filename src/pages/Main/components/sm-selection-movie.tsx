import { FC, useEffect, useRef, useState } from "react"
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Swiper from "react-native-deck-swiper";

import { fetchUserProfile } from "redux/userSlice";
import { AppDispatch } from "redux/configure-store";
import { SMControlBar } from "./sm-control-bar";
import { SMSwipeCards } from "./sm-swipe-cards";
import { OverlayLabel } from "../ui/overlay-label";
import { FiltersSvgIcon } from "shared";
import { Color } from "styles/colors";

const { height, width } = Dimensions.get('window')

export const SMSelectionMovie: FC = () => {
    const { data, loading } = useSelector((state: any) => state.moviesSlice);
    const [allCardsSwiped, setAllCardsSwiped] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const useSwiper = useRef<Swiper<any>>(null);

    if (loading || !data) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const handleOnSwipedLeft = (cardIndex: any) => {
        console.log(`Свайп влево на карточке с индексом ${cardIndex}`);
    };

    const handleOnSwipedRight = (cardIndex: any) => {
        console.log(`Свайп вправо на карточке с индексом ${cardIndex}`);
    };

    const handleOnSwiped = () => {
        if (currentIndex === data.length - 1) {
            setAllCardsSwiped(true);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

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
            {allCardsSwiped && !data.docs.length? (
                <Text style={{
                    fontSize: 22,
                    color: 'white',
                }}>Пусто</Text>
            ) : (
                <View style={{
                    width: width,
                    flex: 0.70,
                    // bottom: 40,
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
                        }}
                    />
                </View>
            )}
            <View style={{
                flex: 0.17,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: width / 2.2,
                bottom: 20,
            }}>
                <SMControlBar
                    onHandleLike={() => useSwiper.current?.swipeRight()}
                    onHandleDislike={() => useSwiper.current?.swipeLeft()}
                />
            </View>
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
});