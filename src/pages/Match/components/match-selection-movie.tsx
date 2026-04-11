import { useDispatch, useSelector } from 'react-redux';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import Swiper from 'react-native-deck-swiper';
import socketService from 'features/match/match-socketService';
import { OverlayLabel } from 'pages/Main/ui/overlay-label';
import { SMControlBar } from 'pages/Main/components/sm-control-bar';
import { NotificationType, WaitingSvgIcon } from 'shared';
import { Color } from 'styles/colors';
import { SMSwipeCards } from 'pages/Main/components/sm-swipe-cards';
import { AppDispatch, store } from 'redux/configure-store';
import { useIsLastCard, useLikeMovieQueue } from '../hooks';
import { checkStatusRedux, updateUserStatusRedux } from 'redux/matchSlice';
import { refetchRoomMoviesToRedux, useRoomMoviesSync, useRoomStateSync } from 'features/match/use-room-movies-sync';
import { MatchStatusCard } from '../ui/match-status-card';
import { MatchUserStatusEnum } from 'features/match/match.model';
import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'app/constants';
import { addNotification } from 'redux/appSlice';
import { MovieLoader } from 'shared/ui/movie-loader';

const { width } = Dimensions.get('window');

export const MatchSelectionMovie: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const queryClient = useQueryClient();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const route = useRoute<RouteProp<RootStackParamList, 'MatchSelectionMovie'>>();
    const { currentUserMatch, movies, room } = useSelector((state: any) => state.matchSlice);
    const { user } = useSelector((state: any) => state.userSlice);
    const { likeMovie, waitForPendingLikes } = useLikeMovieQueue();
    // const { userStatus } = useGetUserStatusByUserId(user?.id);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [isWaitStatus, setIsWaitStatus] = useState<boolean>(false);
    const isLastCard = useIsLastCard(currentCardIndex, movies.data?.docs.length || 0);
    const useSwiper = useRef<Swiper<any>>(null);
    const selectionRoomKey = useMemo(() => {
        const fromRoute = route.params?.roomKey;
        if (typeof fromRoute === 'string' && fromRoute.length > 0) {
            return fromRoute;
        }
        return currentUserMatch?.roomKey ?? (Array.isArray(room) ? room[0]?.roomKey : undefined);
    }, [route.params?.roomKey, currentUserMatch?.roomKey, room]);

    /** Must not change on every swipe — otherwise we `off('broadcastMovies')` and can miss the server push. */
    const roomKeyRef = useRef<string | undefined>(undefined);
    roomKeyRef.current = selectionRoomKey;

    useRoomMoviesSync(selectionRoomKey);
    useRoomStateSync(selectionRoomKey);

    /** Deck finished when entering wait; if Redux gets a new list (e.g. lobby refreshed movies), leave wait. */
    const deckSnapshotAtWaitRef = useRef<string | null>(null);

    useEffect(() => {
        if (selectionRoomKey && user?.id != null) {
            socketService.joinRoom(selectionRoomKey, String(user.id));
        }
    }, [selectionRoomKey, user?.id]);

    useEffect(() => {
        if (movies.data?.docs.length) {
            setIsInitialLoading(false);
        }
    }, [movies.data?.docs.length]);

    /** Stable subscription: room key from ref so we do not detach `broadcastMovies` on roomKey churn. */
    useEffect(() => {
        const handler = (data: any) => {
            const roomKey = roomKeyRef.current;
            if (!roomKey) {
                return;
            }
            console.log('subscr movies: ', data);
            refetchRoomMoviesToRedux(queryClient, dispatch, roomKey)
                .then(() => {
                    dispatch(
                        addNotification({
                            id: new Date().getTime(),
                            message: data.messageForClient,
                            type: 'success' as NotificationType,
                        }),
                    );

                    if (data.messageForClient === 'Final movie selected') {
                        navigation.navigate('MatchResult');
                    }
                    setCurrentCardIndex(0);
                    setIsWaitStatus(false);
                    deckSnapshotAtWaitRef.current = null;
                })
                .catch((error: Error) => {
                    dispatch(
                        addNotification({
                            id: new Date().getTime(),
                            message: `Error loading movies: ${error.message}`,
                            type: 'error' as NotificationType,
                        }),
                    );
                });
        };

        let unsubscribe: (() => void) | undefined;
        try {
            unsubscribe = socketService.subscribeToBroadcastMovies(handler);
        } catch {
            unsubscribe = undefined;
        }

        return () => {
            unsubscribe?.();
        };
    }, [dispatch, navigation, queryClient]);

    useEffect(() => {
        if (!isWaitStatus) {
            return;
        }
        const baseline = deckSnapshotAtWaitRef.current;
        if (!baseline) {
            return;
        }
        const docs = movies.data?.docs;
        if (!docs?.length) {
            return;
        }
        const snap = `${docs.length}:${docs[0]?.id}:${docs[docs.length - 1]?.id}`;
        if (snap !== baseline) {
            deckSnapshotAtWaitRef.current = null;
            setCurrentCardIndex(0);
            setIsWaitStatus(false);
        }
    }, [movies.data?.docs, isWaitStatus]);

    useEffect(() => {
        if (isLastCard) {
            if (!selectionRoomKey || user?.id == null) {
                return;
            }
            const docs = movies.data?.docs;
            deckSnapshotAtWaitRef.current = docs?.length
                ? `${docs.length}:${docs[0]?.id}:${docs[docs.length - 1]?.id}`
                : null;
            setIsWaitStatus(true);
            const checkUserStatus = async () => {
                try {
                    await waitForPendingLikes();
                    await dispatch(
                        updateUserStatusRedux({
                            roomKey: selectionRoomKey,
                            userId: user.id,
                            userStatus: MatchUserStatusEnum.WAITING,
                        }),
                    );
                    const idempotencyKey = `${user.id}-${selectionRoomKey}-${Date.now()}-${Math.random()
                        .toString(36)
                        .slice(2, 11)}`;
                    await dispatch(
                        checkStatusRedux({
                            roomKey: selectionRoomKey,
                            userId: user.id,
                            idempotencyKey,
                        }),
                    ).unwrap();

                    if (selectionRoomKey) {
                        try {
                            const moviesState = store.getState().matchSlice.movies as {
                                data?: { docs?: { id: number }[] };
                            };
                            const beforeDocs = moviesState?.data?.docs;
                            const beforeKey =
                                beforeDocs?.length &&
                                `${beforeDocs.length}:${beforeDocs[0]!.id}:${beforeDocs[beforeDocs.length - 1]!.id}`;
                            await refetchRoomMoviesToRedux(queryClient, dispatch, selectionRoomKey);
                            const afterDocs = (store.getState().matchSlice.movies as typeof moviesState)?.data?.docs;
                            const afterKey =
                                afterDocs?.length &&
                                `${afterDocs.length}:${afterDocs[0]!.id}:${afterDocs[afterDocs.length - 1]!.id}`;
                            if (afterKey && afterKey !== beforeKey) {
                                setCurrentCardIndex(0);
                                setIsWaitStatus(false);
                            }
                        } catch {
                            // Room list may still be unchanged while waiting for partner; WS will refresh when ready.
                        }
                    }

                    dispatch(
                        addNotification({
                            id: new Date().getTime(),
                            message: 'User status updated successfully!',
                            type: 'success' as NotificationType,
                        }),
                    );
                } catch (error) {
                    console.error('Ошибка при обновлении статуса:', error);
                    setIsWaitStatus(false);

                    const errText =
                        typeof error === 'string'
                            ? error
                            : error instanceof Error
                            ? error.message
                            : typeof (error as { message?: string })?.message === 'string'
                            ? (error as { message: string }).message
                            : 'Unknown error';
                    dispatch(
                        addNotification({
                            id: new Date().getTime(),
                            message: `Error updating user status: ${errText}`,
                            type: 'error' as NotificationType,
                        }),
                    );
                }
            };

            checkUserStatus();
        }
    }, [selectionRoomKey, user?.id, isLastCard, dispatch, queryClient, waitForPendingLikes]);

    const handleOnSwiped = useCallback(() => {
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
    }, []);

    const handleLike = useCallback(
        (_cardIndex: number, card?: { id?: number }) => {
            const roomKey = selectionRoomKey;
            const movieId = card?.id ?? movies.data?.docs[currentCardIndex]?.id;
            if (movieId == null || !roomKey || user?.id == null) {
                return;
            }
            void likeMovie({
                userId: user.id,
                roomKey,
                movieId: Number(movieId),
            });
        },
        [currentCardIndex, likeMovie, movies.data?.docs, selectionRoomKey, user?.id],
    );

    const overlayLabels = useMemo(
        () => ({
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
        }),
        [],
    );

    if (isInitialLoading) {
        return (
            <View style={styles.loaderScreen}>
                <MovieLoader />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!isWaitStatus ? (
                <>
                    <View style={styles.swiperClip}>
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
                    <View style={styles.controlsBar}>
                        <SMControlBar
                            onHandleLike={() => useSwiper.current?.swipeRight()}
                            onHandleDislike={() => useSwiper.current?.swipeLeft()}
                        />
                    </View>
                </>
            ) : (
                <MatchStatusCard
                    imageSource={<WaitingSvgIcon />}
                    title="Wait until others make their choice"
                    description="Wait until others make their choice"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loaderScreen: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: Color.BACKGROUND_GREY,
    },
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
