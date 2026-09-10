import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, ParamListBase, RouteProp, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

import { MovieLoader, SettingSvgIcon, SimpleButton } from 'shared';
import { Color } from 'styles/colors';
import socketService from 'features/match/match-socketService';
import { RootStackParamList } from 'app/constants';
import { MatchUserCard } from './match-user-card';
import { useTranslation } from 'react-i18next';
import { AppDispatch } from 'redux/configure-store';
import { MatchFilterModal } from '../ui';
import {
    getMatchDataRedux,
    resetMovies,
    startMatchRedux,
    updateRoomFiltersRedux,
    updateRoomUsers,
} from 'redux/matchSlice';
import { useWebSocket } from '../hooks';
import { Role } from 'features/match/match.model';
import { getRoomFilters } from 'features/match/match-service';
import { ISMFormData, RoomFiltersUpdatedEvent } from 'pages/Main/sm.model';
import { roomMoviesQueryKey } from 'features/match/query-client';
import { refetchRoomMoviesToRedux, useRoomMoviesSync, useRoomStateSync } from 'features/match/use-room-movies-sync';
import { LobbyOnboardingModal, useLobbyOnboarding } from 'features/lobby-onboarding';

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
    const [modalVisible, setModalVisible] = useState(false);
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

    const myRoomIdForFilters = useMemo(() => {
        if (!user?.id || !Array.isArray(room) || room.length === 0) {
            return currentUserMatch?.roomId;
        }
        const row = room.find((m: { userId: number }) => m.userId === user.id);
        return row?.roomId ?? currentUserMatch?.roomId;
    }, [room, user?.id, currentUserMatch?.roomId]);

    const roomKeyRef = useRef<string | undefined>(undefined);
    roomKeyRef.current = lobbyRoomKey;

    const roomKeyForMovies = lobbyRoomKey;
    useRoomMoviesSync(roomKeyForMovies);
    useRoomStateSync(roomKeyForMovies);

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
            async (data: { roomKey?: string } | undefined) => {
                const key = roomKeyRef.current;
                if (!key) {
                    return;
                }
                if (data?.roomKey != null && data.roomKey !== key) {
                    return;
                }
                await queryClient.invalidateQueries({ queryKey: roomMoviesQueryKey(key) });
                await refetchRoomMoviesToRedux(queryClient, dispatch, key);
            },
        );

        return () => {
            unsubBroadcastMatch();
            unsubRequestMatch();
            unsubFilters();
            unsubBroadcastMovies();
        };
    }, [dispatch, queryClient, lobbyRoomKey]);

    const handleOnSubmit = async () => {
        if (!lobbyRoomKey) {
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
            Alert.alert('Success', 'Filters updated successfully.');
        } catch (error) {
            Alert.alert(
                'Error',
                typeof error === 'string' ? error : 'Failed to update filters due to an unexpected error',
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
                modalVisible={modalVisible}
                setModalVisible={() => setModalVisible(false)}
                onFiltersChange={handleModalClose}
                initialFilters={filters}
            />
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <Text
                        style={{
                            color: Color.WHITE,
                            fontSize: 16,
                            fontWeight: '700',
                            lineHeight: 19.2,
                        }}
                    >
                        {t('match_movie.lobby.lobby_members')}
                    </Text>
                    {myRoleInLobby === Role.ADMIN && (
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                height: 48,
                            }}
                            onPress={() => setModalVisible(true)}
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
                    title="Continue Match"
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
                        title="Start Match"
                        color={Color.BUTTON_RED}
                        titleColor={Color.WHITE}
                        buttonWidth={width - 32}
                        onHandlePress={handleOnSubmit}
                        disabled={loading}
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
