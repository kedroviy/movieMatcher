import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    RefreshControl,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NavigationProp, ParamListBase, RouteProp, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

import { MovieLoader, ShareSvgIcon, SettingSvgIcon, SimpleButton } from 'shared';
import { Color } from 'styles/colors';
import socketService from 'features/match/match-socketService';
import { RootStackParamList } from 'app/constants';
import { MatchUserCard } from './match-user-card';
import { useTranslation } from 'react-i18next';
import { AppDispatch, store } from 'redux/configure-store';
import { MatchFilterModal } from '../ui';
import {
    getMatchDataRedux,
    joinRoom,
    resetMovies,
    setMatchStatus,
    startMatchRedux,
    updateRoomFiltersRedux,
    updateRoomUsers,
} from 'redux/matchSlice';
import {
    buildLobbySharePayload,
    consumeLobbyOpenedFromInvite,
    isShareCancelled,
} from 'features/match/lobby-invite-link';
import { useWebSocket } from '../hooks';
import { Role } from 'features/match/match.model';
import { getRoomFilters } from 'features/match/match-service';
import { ISMFormData, RoomFiltersUpdatedEvent } from 'pages/Main/sm.model';
import { roomMoviesQueryKey } from 'features/match/query-client';
import { refetchRoomMoviesToRedux, useRoomMoviesSync, useRoomStateSync } from 'features/match/use-room-movies-sync';
import { LobbyOnboardingModal, useLobbyOnboarding } from 'features/lobby-onboarding';
import { getMatchPhaseFromMoviesPayload, isSwipeMatchPhase } from '../utils/match-deck';

type MatchLobbyProps = {
    route: RouteProp<RootStackParamList, 'MatchLobby'>;
};

const { width } = Dimensions.get('window');

export const MatchLobby: FC<MatchLobbyProps> = ({ route }) => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const dispatch: AppDispatch = useDispatch();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { loading, room, role, currentUserMatch, currentMovie, movies, matchStatus } = useSelector(
        (state: any) => state.matchSlice,
    );
    const { user } = useSelector((state: any) => state.userSlice);
    const [refreshing, setRefreshing] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterModalKey, setFilterModalKey] = useState(0);
    const [filters, setFilters] = useState<ISMFormData | null>(null);
    const dataFromSocket = useWebSocket();
    const { visible: lobbyOnboardingVisible, dismiss: dismissLobbyOnboarding } = useLobbyOnboarding();

    const lobbyRoomKey = route.params?.lobbyName;

    const showLobbyOnboarding = lobbyOnboardingVisible && Boolean(lobbyRoomKey) && !loading;

    const myRoleInLobby = useMemo(() => {
        if (!user?.id || !Array.isArray(room) || room.length === 0) {
            return role;
        }
        const row = room.find((m: { userId: number }) => m.userId === user.id);
        return (row?.role as Role) ?? role;
    }, [room, user?.id, role]);

    const lobbyParticipantCount = Array.isArray(room) ? room.length : 0;
    const canStartMatch = lobbyParticipantCount >= 2;

    const myRoomIdForFilters = useMemo(() => {
        if (!user?.id || !Array.isArray(room) || room.length === 0) {
            return currentUserMatch?.roomId;
        }
        const row = room.find((m: { userId: number }) => m.userId === user.id);
        return row?.roomId ?? currentUserMatch?.roomId;
    }, [room, user?.id, currentUserMatch?.roomId]);

    const roomKeyRef = useRef<string | undefined>(undefined);
    const joinedFromInviteRef = useRef<string | null>(null);
    roomKeyRef.current = lobbyRoomKey;

    const roomKeyForMovies = lobbyRoomKey;
    useRoomMoviesSync(roomKeyForMovies);
    useRoomStateSync(roomKeyForMovies);

    const openFilterModal = useCallback(() => {
        setFilterModalKey((key) => key + 1);
        setModalVisible(true);
    }, []);

    useEffect(() => {
        navigation.setOptions({ gestureEnabled: !modalVisible });
        return () => {
            navigation.setOptions({ gestureEnabled: true });
        };
    }, [navigation, modalVisible]);

    useEffect(() => {
        if (!modalVisible) {
            return;
        }
        return navigation.addListener('beforeRemove', (event) => {
            event.preventDefault();
            setModalVisible(false);
        });
    }, [navigation, modalVisible]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            if (lobbyRoomKey) {
                await dispatch(getMatchDataRedux(lobbyRoomKey));
                await refetchRoomMoviesToRedux(queryClient, dispatch, lobbyRoomKey);
            }
        } finally {
            setRefreshing(false);
        }
    }, [lobbyRoomKey, dispatch, queryClient]);

    useEffect(() => {
        if (!lobbyRoomKey) {
            return;
        }
        dispatch(resetMovies());
        dispatch(getMatchDataRedux(lobbyRoomKey));
    }, [lobbyRoomKey, dispatch]);

    useEffect(() => {
        if (!lobbyRoomKey || user?.id == null) {
            return;
        }
        if (!consumeLobbyOpenedFromInvite(lobbyRoomKey)) {
            return;
        }
        const members = Array.isArray(room) ? room : [];
        const alreadyMember = members.some(
            (member: { userId?: number; roomKey?: string }) =>
                member.userId === user.id && member.roomKey === lobbyRoomKey,
        );
        if (alreadyMember || joinedFromInviteRef.current === lobbyRoomKey) {
            return;
        }
        joinedFromInviteRef.current = lobbyRoomKey;
        void dispatch(joinRoom({ key: lobbyRoomKey, userId: user.id }));
    }, [lobbyRoomKey, user?.id, room, dispatch]);

    useEffect(() => {
        if (!lobbyRoomKey) {
            return;
        }
        let cancelled = false;
        void getRoomFilters(lobbyRoomKey)
            .then((next) => {
                if (!cancelled) {
                    setFilters(next);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setFilters(null);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [lobbyRoomKey]);

    useEffect(() => {
        if (lobbyRoomKey && user?.id != null) {
            socketService.joinRoom(lobbyRoomKey, String(user.id));
        }
    }, [lobbyRoomKey, user?.id]);

    useEffect(() => {
        if (dataFromSocket) {
            dispatch(updateRoomUsers(dataFromSocket));
        }
    }, [dataFromSocket, dispatch]);

    useEffect(() => {
        const hasDeck = Boolean(movies.data?.docs?.length);
        const matchStarted = matchStatus === 'started' || matchStatus === 'already_started';
        if (hasDeck && lobbyRoomKey && matchStarted) {
            navigation.navigate('MatchSelectionMovie', { movie: currentMovie, roomKey: lobbyRoomKey });
        }
    }, [movies.data?.docs?.length, matchStatus, navigation, currentMovie, lobbyRoomKey]);

    useEffect(() => {
        const handleFiltersUpdated = (data: RoomFiltersUpdatedEvent) => {
            setFilters(data.filters ?? null);
        };

        const unsubBroadcastMatch = socketService.subscribeToBroadcastMatchUpdate(
            async (data: { roomKey?: string } | undefined) => {
                const key = roomKeyRef.current;
                if (!key) {
                    return;
                }
                if (data?.roomKey != null && data.roomKey !== key) {
                    return;
                }
                await dispatch(getMatchDataRedux(key));
            },
        );

        const unsubRequestMatch = socketService.subscribeToRequestMatchUpdate(async () => {
            const key = roomKeyRef.current;
            if (key) {
                await dispatch(getMatchDataRedux(key));
            }
        });

        const unsubFilters = socketService.filtersUpdateBroadcast(handleFiltersUpdated);

        const unsubBroadcastMovies = socketService.subscribeToBroadcastMovies(
            async (data: { roomKey?: string; matchPhase?: string } | undefined) => {
                const key = roomKeyRef.current;
                if (!key) {
                    return;
                }
                if (data?.roomKey != null && String(data.roomKey) !== String(key)) {
                    return;
                }
                await queryClient.invalidateQueries({ queryKey: roomMoviesQueryKey(key) });
                await refetchRoomMoviesToRedux(queryClient, dispatch, key);
                const moviesAfter = (store.getState() as { matchSlice: { movies: unknown } }).matchSlice.movies;
                const phase = data?.matchPhase ?? getMatchPhaseFromMoviesPayload(moviesAfter);
                if (isSwipeMatchPhase(phase)) {
                    dispatch(setMatchStatus('started'));
                }
            },
        );

        return () => {
            unsubBroadcastMatch();
            unsubRequestMatch();
            unsubFilters();
            unsubBroadcastMovies();
        };
    }, [dispatch, queryClient, lobbyRoomKey]);

    const shareInvite = useCallback(async () => {
        if (!lobbyRoomKey || isSharing) {
            return;
        }
        const inviter = user?.username?.trim() || 'Movie Match';
        const payload = buildLobbySharePayload({
            title: t('match_movie.lobby.share_title'),
            text: t('match_movie.lobby.share_text', { roomKey: lobbyRoomKey, inviter }),
            roomKey: lobbyRoomKey,
            includeUrlInMessage: Platform.OS !== 'ios',
        });
        setIsSharing(true);
        try {
            await Share.share(payload);
        } catch (error) {
            if (!isShareCancelled(error)) {
                Alert.alert(t('prompts.error'), t('match_movie.lobby.share_failed'));
            }
        } finally {
            setIsSharing(false);
        }
    }, [isSharing, lobbyRoomKey, t, user?.username]);

    const handleOnSubmit = async () => {
        if (!lobbyRoomKey || !canStartMatch) {
            return;
        }
        const actionResult = await dispatch(startMatchRedux(lobbyRoomKey));
        if (startMatchRedux.fulfilled.match(actionResult)) {
            await socketService.requestBroadcatingMovies(lobbyRoomKey);
        } else {
            console.log('handleSubmit: Action failed:', actionResult);
        }
    };

    const handleModalClose = async (nextFilters: ISMFormData) => {
        if (!myRoomIdForFilters) {
            return;
        }
        try {
            setFilters(nextFilters);
            await dispatch(
                updateRoomFiltersRedux({
                    roomId: String(myRoomIdForFilters),
                    filters: nextFilters,
                }),
            ).unwrap();
            Alert.alert(t('prompts.success'), t('prompts.filters_updated'));
        } catch (error) {
            Alert.alert(
                t('prompts.error'),
                typeof error === 'string' ? error : t('prompts.filters_update_failed'),
            );
        }
    };

    return (
        <View style={styles.container}>
            <LobbyOnboardingModal visible={showLobbyOnboarding} onClose={() => void dismissLobbyOnboarding()} />
            {loading && (
                <View style={styles.loaderContainer}>
                    <MovieLoader />
                </View>
            )}
            <MatchFilterModal
                key={filterModalKey}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                onFiltersChange={handleModalClose}
                initialFilters={filters}
            />
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerTitleRow}>
                        <Text style={styles.headerTitle}>{t('match_movie.lobby.lobby_members')}</Text>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel={t('match_movie.lobby.share_aria')}
                            style={[styles.shareButton, (!lobbyRoomKey || isSharing) && styles.shareButtonDisabled]}
                            onPress={() => void shareInvite()}
                            disabled={!lobbyRoomKey || isSharing}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <ShareSvgIcon />
                        </TouchableOpacity>
                    </View>
                    {myRoleInLobby === Role.ADMIN && (
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                height: 48,
                            }}
                            onPress={openFilterModal}
                        >
                            <SettingSvgIcon />
                        </TouchableOpacity>
                    )}
                </View>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    {Array.isArray(room) &&
                        room?.map((user: any) => (
                            <MatchUserCard
                                key={user.userId}
                                id={user.userId}
                                username={user.userName}
                                role={user.role}
                            />
                        ))}
                </ScrollView>
            </View>
            {movies.data?.docs ? (
                <SimpleButton
                    title={t('prompts.continue_match')}
                    color={Color.BUTTON_RED}
                    titleColor={Color.WHITE}
                    buttonWidth={width - 32}
                    onHandlePress={() =>
                        lobbyRoomKey
                            ? navigation.navigate('MatchSelectionMovie', { movie: currentMovie, roomKey: lobbyRoomKey })
                            : navigation.navigate('MatchSelectionMovie', { movie: currentMovie })
                    }
                    disabled={loading}
                />
            ) : (
                myRoleInLobby === Role.ADMIN && (
                    <SimpleButton
                        title={t('prompts.start_match')}
                        color={Color.BUTTON_RED}
                        titleColor={Color.WHITE}
                        buttonWidth={width - 32}
                        onHandlePress={handleOnSubmit}
                        disabled={loading || !canStartMatch}
                    />
                )
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
        paddingVertical: 32,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width - 32,
        paddingBottom: 24,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        gap: 4,
    },
    headerTitle: {
        color: Color.WHITE,
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 19.2,
        flexShrink: 1,
    },
    shareButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareButtonDisabled: {
        opacity: 0.45,
    },
    mainContainer: {
        width: width - 32,
        flex: 1,
    },
    controlsContainer: {
        gap: 16,
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28.8,
        color: Color.WHITE,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
