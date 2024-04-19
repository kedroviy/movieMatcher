import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { AppRoutes } from "app/constants";
import { FC } from "react"
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/configure-store";
import { createRoom } from "redux/matchSlice";
import { SimpleButton } from "shared";
import { Color } from "styles/colors";

const { width } = Dimensions.get('window');

export const MatchScreen: FC = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const dispatch: AppDispatch = useDispatch();
    const { t } = useTranslation();
    const { loading, error, room } = useSelector((state: any) => state.matchSlice);

    const handleCreateRoom = async (userId: number) => {
        dispatch(createRoom(userId))
            .unwrap()
            .then((newRoom) => {
                console.log('Room created:', newRoom);
                navigation.navigate(AppRoutes.MATCH_NAVIGATOR, {
                    screen: AppRoutes.MATCH_LOBBY,
                    params: { lobbyName: newRoom.key },
                });
            })
            .catch((errMsg) => {
                console.error('Error creating room:', errMsg);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={[styles.text,
                {
                    fontSize: 24,
                    fontWeight: '700',
                    lineHeight: 28.8,
                }
                ]}>
                    {t('match_movie.main_match_screen.greetings')}, Username!
                </Text>
            </View>
            <View style={styles.mainContainer}>
                <Image
                    style={{ height: 220, marginBottom: 16 }}
                    source={require('../../../assets/image41.png')}
                />
                <Text
                    style={[styles.text,
                    {
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: '400',
                        lineHeight: 20.8,
                    }
                    ]}
                >
                    {t('match_movie.main_match_screen.main_text')}
                </Text>
            </View>
            <View style={styles.controlsContainer}>
                <SimpleButton
                    title={t('match_movie.main_match_screen.create_lobby_btn')}
                    color={Color.BUTTON_RED}
                    titleColor={Color.WHITE}
                    buttonWidth={width - 32}
                    onHandlePress={() => handleCreateRoom(1)}
                />
                <SimpleButton
                    title={t('match_movie.main_match_screen.join_lobby_btn')}
                    color={Color.BACKGROUND_GREY}
                    titleColor={Color.WHITE}
                    buttonWidth={width - 32}
                    onHandlePress={() => console.log('join')}
                    buttonStyle={{
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: Color.WHITE
                    }}
                />
            </View>
            {loading && <Text>Loading...</Text>}
            {error && <Text>Error: {error}</Text>}
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
        width: width,
        paddingLeft: 16,
    },
    mainContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 0.8,
        width: width -32
    },
    controlsContainer: {
        gap: 16,
    },
    text: {

        color: Color.WHITE
    }
});