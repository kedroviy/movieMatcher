import { FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { SettingSvgIcon, SimpleButton } from "shared";
import { Color } from "styles/colors";
import socketService from "features/match/match-socketService";
import { RootStackParamList } from "app/constants";
import { MatchUserCard } from "./match-user-card";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "redux/configure-store";
import { MatchFilterModal } from "../ui";
import {
    getMatchDataRedux,
    getMoviesRedux,
    startMatchRedux,
    updateRoomFiltersRedux,
    updateRoomUsers,
} from "redux/matchSlice";
import { useWebSocket } from "../hooks";
import useUserHasRoom from "../hooks/useUserHasRoom";
import { Role } from "features/match/match.model";

type MatchLobbyProps = {
    route: RouteProp<RootStackParamList, 'MatchLobby'>;
};

const { width } = Dimensions.get('window')

export const MatchLobby: FC<MatchLobbyProps> = ({ route }) => {
    const { lobbyName } = route.params;
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const dispatch: AppDispatch = useDispatch();
    const { t } = useTranslation();
    const {
        loading,
        room,
        role,
        currentUserMatch,
        currentMovie,
        movies,
        matchStatus,
    } = useSelector((state: any) => state.matchSlice);
    const { user } = useSelector((state: any) => state.userSlice);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [filters, setFilters] = useState<any>({});
    const dataFromSocket = useWebSocket();

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await dispatch(getMatchDataRedux(currentUserMatch?.roomKey));
        } finally {
            setRefreshing(false);
        }
    }, [lobbyName, currentUserMatch?.roomKey]);

    useEffect(() => {
        if (currentUserMatch?.roomKey) {
            dispatch(getMatchDataRedux(currentUserMatch?.roomKey))
            dispatch(getMoviesRedux(currentUserMatch?.roomKey))
        }
    }, []);

    useEffect(() => {
        const handleFiltersUpdated = (data: any) => {
            setFilters(data.filters);
        };

        socketService.subscribeToRequestMatchUpdate(async () => {
            if (currentUserMatch?.roomKey) {
                await dispatch(getMatchDataRedux(currentUserMatch?.roomKey))
            } else if (room[0].roomKey) {
                await dispatch(getMatchDataRedux(room[0].roomKey))
            }
        });

        socketService.filtersUpdateBroadcast(handleFiltersUpdated);

        socketService.subscribeToBroadcastMovies(async () => {
            if (currentUserMatch?.roomKey) {
                await dispatch(getMoviesRedux(currentUserMatch?.roomKey))
            } else if (room[0].roomKey) {
                await dispatch(getMoviesRedux(room[0].roomKey))
            }
        });

        if (dataFromSocket) {
            console.log('dataFromSocket: ', dataFromSocket);
            dispatch(updateRoomUsers(dataFromSocket));
        }

        if (movies.data?.docs.length) {
            navigation.navigate('MatchSelectionMovie', { movie: currentMovie });
        }

        console.log('room: ', room);

        return () => {
            socketService.unsubscribeFromRequestMatchUpdate();
            socketService.unsubscribeFromRequestMatchResponse();
            socketService.unsubscribeToBroadcastMatchUpdate();
            socketService.unsubscribeBroadcastMovies();
            socketService.unsubscribeFromMatchUpdates();
            socketService.unsubscribeToJoinNewUser();
        };
    }, [
        dataFromSocket,
        socketService,
        currentUserMatch?.roomKey,
        room,
        dispatch,
        user.id,
        role,
        filters,
        movies.data?.docs.length,
        matchStatus,
    ]);

    const handleFiltersChange = (newFilters: SetStateAction<{}>) => {
        setFilters(newFilters);
    };

    const handleOnSubmit = async () => {
        const actionResult = await dispatch(startMatchRedux(room[0].roomKey));
        if (startMatchRedux.fulfilled.match(actionResult)) {
            await socketService.requestBroadcatingMovies(room[0].roomKey);
        } else {
            console.log('handleSubmit: Action failed:', actionResult);
        }
    };

    const handleModalClose = async (filters: any) => {
        console.log('filters: ', filters)
        if (filters) {
            try {
                setFilters(filters);
                console.log(filters)
                await dispatch(updateRoomFiltersRedux(
                    {
                        userId: user.id, roomId: currentUserMatch?.roomId, filters: filters
                    } as any))
                    .unwrap()
                    .then(() => {
                        socketService.filtersUpdateBroadcast((filtersFromSocket: any) => {
                            setFilters(filtersFromSocket)
                        });
                        Alert.alert("Success", "Filters updated successfully.");
                    })
                    .catch(error => {
                        Alert.alert("Error", typeof error === 'string' ? error : 'Failed to update filters due to an unexpected error');
                    });
            } catch (error) {
                throw new Error(error as string);
            }
        }
    };

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={Color.BUTTON_RED} />
                </View>
            )}
            <MatchFilterModal
                modalVisible={modalVisible}
                setModalVisible={() => setModalVisible(false)}
                onFiltersChange={(filtersData) => handleModalClose(filtersData)}
            />
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <Text style={{
                        color: Color.WHITE,
                        fontSize: 16,
                        fontWeight: '700',
                        lineHeight: 19.2,
                    }}>
                        {t('match_movie.lobby.lobby_members')}
                    </Text>
                    {Boolean(role) &&
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                height: 48
                            }}
                            onPress={() => setModalVisible(true)}
                        >
                            <SettingSvgIcon />
                        </TouchableOpacity>}
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {Array.isArray(room) && room?.map((user: any) => (
                        <MatchUserCard
                            key={user.userId}
                            id={user.userId}
                            username={user.userName}
                            role={user.role}
                        />
                    ))}
                </ScrollView>
            </View>
            {movies.data?.docs ?
                <SimpleButton
                    title='Continue Match'
                    color={Color.BUTTON_RED}
                    titleColor={Color.WHITE}
                    buttonWidth={width - 32}
                    onHandlePress={() => navigation.navigate('MatchSelectionMovie', { movie: currentMovie })}
                    disabled={loading}
                /> :
                role === Role.ADMIN &&
                <SimpleButton
                    title='Start Match'
                    color={Color.BUTTON_RED}
                    titleColor={Color.WHITE}
                    buttonWidth={width - 32}
                    onHandlePress={handleOnSubmit}
                    disabled={loading}
                />
            }
        </View >
    )
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
        color: Color.WHITE
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