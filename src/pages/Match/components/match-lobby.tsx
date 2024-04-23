import { RouteProp } from "@react-navigation/native";
import { FC, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import { useSelector } from "react-redux";

import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { FiltersSvgIcon, SimpleButton } from "shared";
import { Color } from "styles/colors";
import socketService from "features/match/match-socketService";
import { RootStackParamList } from "app/constants";

type MatchLobbyProps = {
    route: RouteProp<RootStackParamList, 'MatchLobby'>;
};

const { width } = Dimensions.get('window')

export const MatchLobby: FC<MatchLobbyProps> = ({ route }) => {
    const { lobbyName } = route.params;
    const { loading, room } = useSelector((state: any) => state.matchSlice);
    const [roomUsers, setRoomUsers] = useState<any>([]);
    // const [matchDetails, setMatchDetails] = useState(null);

    useEffect(() => {
        if (room && Array.isArray(room)) {
            console.log('room is array')
            setRoomUsers(room);
        }
        const serverUrl = "https://movie-match-x5ue.onrender.com/rooms";
        socketService.connect(serverUrl);

        // socketService.subscribeToRoomUpdates((data) => {
        //     console.log('room updated 2')
        //     if (data) {
        //         console.log('room updated 1')
        //         setRoomUsers(data.matchDetails);
        //     }
        // });

        if (!roomUsers.length) {
            console.log('match update')
            socketService.subscribeToMatchUpdates(room.roomKey);
        }
        socketService.subscribeToMatchUpdates(room.roomKey);
        

        console.log('roomdetails: ', roomUsers);

        return () => {
            socketService.unsubscribeFromRoomUpdates();
            socketService.disconnect();
        };
    }, [socketService, room]);

    const handleMatchUpdate = (data: any) => {
        console.log('Received match update:', data);
        setRoomUsers(data);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}
            >
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
            </View>
            <View style={styles.mainContainer}>
                <ScrollView>
                    {roomUsers.map((user: any) => (
                        <View key={user.id} style={{ flexDirection: 'row', width: width - 32, justifyContent: 'space-around' }}>
                            <Text style={{ color: Color.WHITE }}>{user.userName}</Text>
                            <Text style={{ color: Color.WHITE }}>{user.role}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <SimpleButton
                title='Start Match'
                color={Color.BUTTON_RED}
                titleColor={Color.WHITE}
                buttonWidth={width - 32}
                onHandlePress={() => console.log('start match')}
            />
        </View>
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
        width: width - 33,
        height: 48,
    },
    mainContainer: {
        width: width - 33,
        flex: 0.6,
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