import { useDispatch, useSelector } from "react-redux";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import Swiper from "react-native-deck-swiper";
import socketService from "features/match/match-socketService";
import { OverlayLabel } from "pages/Main/ui/overlay-label";
import { SMControlBar } from "pages/Main/components/sm-control-bar";
import { Loader, WaitingSvgIcon } from "shared";
import { Color } from "styles/colors";
import { SMSwipeCards } from "pages/Main/components/sm-swipe-cards";
import { AppDispatch } from "redux/configure-store";
import { useIsLastCard, useLikeMovieQueue } from "../hooks";
import { checkStatusRedux, getMoviesRedux, updateUserStatusRedux } from "redux/matchSlice";
import { MatchStatusCard } from "../ui/match-status-card";
import { useGetUserStatusByUserId } from "../hooks/useGetUserStatusByUserId";
import { MatchUserStatusEnum } from "features/match/match.model";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

export const MatchSelectionMovie: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { currentUserMatch, movies } = useSelector((state: any) => state.matchSlice);
    const { user } = useSelector((state: any) => state.userSlice);
    const { likeMovie, isProcessing } = useLikeMovieQueue();
    const { userStatus } = useGetUserStatusByUserId(user?.id);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [isWaitStatus, setIsWaitStatus] = useState<boolean>(false);
    const [isFinalResult, setIsFinalResult] = useState<boolean>(false);
    const isLastCard = useIsLastCard(currentCardIndex, movies.data?.docs.length || 0);
    const useSwiper = useRef<Swiper<any>>(null);

    useEffect(() => {
        if (movies.data?.docs.length) {
            setIsInitialLoading(false);
        }

        socketService.subscribeToBroadcastMovies((data: any) => {
            console.log('broadcasting in selection component?: ', data)
            dispatch(getMoviesRedux(currentUserMatch?.roomKey))
                .then((action) => {
                    if (data.messageForClient === 'Final movie selected') {
                        navigation.navigate('MatchResult');
                    }
                    setCurrentCardIndex(0);
                    setIsWaitStatus(false);
                    const { payload } = action;
                })
                .catch((error) => {
                    console.error('Ошибка при загрузке фильмов:', error);
                });
        });

        return () => {
            socketService.unsubscribeBroadcastMovies();
        };
    }, [socketService, movies.data?.docs.length, currentCardIndex, isLastCard, isWaitStatus]);

    useEffect(() => {
        if (isLastCard) {
            setIsWaitStatus(true);
            const checkUserStatus = async () => {
                try {
                    console.log('update status')
                    await dispatch(updateUserStatusRedux(
                        { roomKey: currentUserMatch?.roomKey, userId: user.id, userStatus: MatchUserStatusEnum.WAITING }
                    ));
                    await dispatch(checkStatusRedux({ roomKey: currentUserMatch?.roomKey, userId: user.id })).unwrap();
                } catch (error) {
                    throw new Error(error as string);
                }
            };

            checkUserStatus();
        }
    }, [currentUserMatch?.roomKey, user.id, isLastCard]);

    const handleOnSwiped = useCallback(() => {
        setCurrentCardIndex(prevIndex => prevIndex + 1);
    }, []);

    const handleLike = useCallback(() => {
        console.log(currentUserMatch?.roomKey)
        if (movies.data?.docs[currentCardIndex]) {
            likeMovie({
                userId: user.id,
                roomKey: currentUserMatch?.roomKey!,
                movieId: movies.data.docs[currentCardIndex].id,
            });
        }
    }, [currentCardIndex, likeMovie, movies.data?.docs, currentUserMatch?.roomKey, user.id]);

    const overlayLabels = useMemo(() => ({
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
    }), []);

    if (isInitialLoading) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            {!isWaitStatus ?
                <>
                    <View style={{
                        width: width,
                        flex: 1,
                    }}>
                        <Swiper
                            ref={useSwiper}
                            animateCardOpacity
                            containerStyle={styles.swiperContainer}
                            cards={movies.data?.docs}
                            renderCard={(card) => <SMSwipeCards card={card} />}
                            cardIndex={currentCardIndex}
                            backgroundColor={Color.BACKGROUND_GREY}
                            stackSize={2}
                            stackSeparation={-20}
                            horizontalSwipe
                            verticalSwipe={false}
                            showSecondCard
                            animateOverlayLabelsOpacity
                            onSwipedLeft={() => console.log('dislike')}
                            onSwipedRight={handleLike}
                            onSwiped={handleOnSwiped}
                            overlayLabels={overlayLabels}
                        />
                    </View>
                    <View style={{
                        flex: 0.2,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        width: width / 2.2,
                    }}>
                        <SMControlBar
                            onHandleLike={() => useSwiper.current?.swipeRight()}
                            onHandleDislike={() => useSwiper.current?.swipeLeft()}
                        />
                    </View>
                </> :
                <MatchStatusCard
                    imageSource={<WaitingSvgIcon />}
                    title="Wait until others make their choice"
                    description="Wait until others make their choice"
                />
            }
        </View>
    )
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
