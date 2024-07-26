import { FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { 
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
        roomKey, 
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
            await socketService.requestMatchUpdate(lobbyName && roomKey);
        } finally {
            setRefreshing(false);
        }
    }, [lobbyName, roomKey]);

    useEffect(() => {
        dispatch(getMoviesRedux(room[0].roomKey))
    }, []);

    useEffect(() => {
        const handleFiltersUpdated = (data: any) => {
            setFilters(data.filters);
        };

        const matchUpdateSocket = async () => {
            await dispatch(getMatchDataRedux(room[0].roomKey))
        };

        const handleBroadcasting = async () => {
            await dispatch(getMoviesRedux(room[0].roomKey))
        }

        socketService.filtersUpdateBroadcast(handleFiltersUpdated);
        socketService.subscribeToJoinNewUser(matchUpdateSocket);
        socketService.subscribeToBroadcastMovies(handleBroadcasting);

        if (dataFromSocket) {
            dispatch(updateRoomUsers(dataFromSocket));
        }

        if (movies.data?.docs.length) {
            navigation.navigate('MatchSelectionMovie', { movie: currentMovie });
        }

        return () => {
            socketService.unsubscribeFromRequestMatchUpdate();
            socketService.unsubscribeFromRequestMatchResponse();
            socketService.unsubscribeBroadcastMovies();
            socketService.unsubscribeFromMatchUpdates();
            socketService.unsubscribeToJoinNewUser();
        };
    }, [
        dataFromSocket, 
        socketService, 
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
        console.log('handleSubmit: ', actionResult);
        // try {
        //     startMatchRedux.fulfilled.match(actionResult);
        // } catch (error) {
        //     Alert.alert('Error', 'Failed to start the match due to an unexpected error');
        // }
    };

    const handleModalClose = async (saveChanges: any) => {
        setModalVisible(false);
        if (saveChanges) {
            const handleFiltersUpdated = (data: any) => {
                try {
                    setFilters(data.filters);
                } catch (error) {
                    throw new Error(error as string);
                }
            };
            await dispatch(updateRoomFiltersRedux(
                { 
                    userId: user.id, roomId: room[0].roomId, filters: filters
                } as any))
                .unwrap()
                .then(response => {
                    socketService.filtersUpdateBroadcast(handleFiltersUpdated);
                    Alert.alert("Success", "Filters updated successfully.");
                })
                .catch(error => {
                    Alert.alert("Error", typeof error === 'string' ? error : 'Failed to update filters due to an unexpected error');
                });
        }
    };

    return (
        <View style={styles.container}>
            <MatchFilterModal
                modalVisible={modalVisible}
                setModalVisible={() => handleModalClose(filters)}
                onFiltersChange={handleFiltersChange}
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
                Boolean(role) &&
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
    }
});