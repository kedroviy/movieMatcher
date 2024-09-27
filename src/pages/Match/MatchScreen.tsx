import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { AppRoutes } from "app/constants";
import { FC, useEffect } from "react"
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/configure-store";
import { createRoom, resetMovies } from "redux/matchSlice";
import { MovieLoader, SimpleButton } from "shared";
import useFetchUserProfile from "shared/hooks/getUserProfile";
import { Color } from "styles/colors";
import useUserHasRoom from "./hooks/useUserHasRoom";

const { width } = Dimensions.get('window');

export const MatchScreen: FC = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const dispatch: AppDispatch = useDispatch();
    const { t } = useTranslation();
    const { user, loading: userLoading, error: userError } = useFetchUserProfile();
    const { currentUserMatch, loading: roomLoading, error: roomError } = useUserHasRoom(user?.id);
    const { loading: matchLoading, error: matchError } = useSelector((state: any) => state.matchSlice);

    useEffect(() => {
        dispatch(resetMovies())
    }, []);

    const handleCreateRoom = async (userId: number) => {
        if (currentUserMatch?.roomKey) {
            navigation.navigate(AppRoutes.MATCH_NAVIGATOR, {
                screen: AppRoutes.MATCH_LOBBY,
                params: { lobbyName: currentUserMatch?.roomKey },
            });
        } else {
            try {
                const newRoom: any = await dispatch(createRoom(userId)).unwrap();

                navigation.navigate(AppRoutes.MATCH_NAVIGATOR, {
                    screen: AppRoutes.MATCH_LOBBY,
                    params: { lobbyName: newRoom.roomKey },
                });
            } catch (errMsg) {
                throw new Error(errMsg as string);
            }
        }
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
                    {t('match_movie.main_match_screen.greetings')}, {user ? user.username : 'Username'}!
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
                {roomLoading || userLoading && !user ? (
                    <MovieLoader />
                ) : (
                    <>
                        <SimpleButton
                            title={userLoading
                                ? t('match_movie.main_match_screen.loading')
                                : t(currentUserMatch?.roomKey
                                    ? 'match_movie.main_match_screen.reconnect_lobby_btn'
                                    : 'match_movie.main_match_screen.create_lobby_btn'
                                )}
                            color={Color.BUTTON_RED}
                            titleColor={Color.WHITE}
                            buttonWidth={width - 32}
                            onHandlePress={() => handleCreateRoom(user.id)}
                            disabled={userLoading} />
                        <SimpleButton
                            title={t('match_movie.main_match_screen.join_lobby_btn')}
                            color={Color.BACKGROUND_GREY}
                            titleColor={Color.WHITE}
                            buttonWidth={width - 32}
                            onHandlePress={() => (navigation.navigate(AppRoutes.MATCH_NAVIGATOR, {
                                screen: AppRoutes.MATCH_JOIN_LOBBY,
                            }))}
                            buttonStyle={{
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: Color.WHITE
                            }} />
                    </>
                )}
            </View>
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
        width: width - 32
    },
    controlsContainer: {
        gap: 16,
    },
    text: {
        color: Color.WHITE
    }
});