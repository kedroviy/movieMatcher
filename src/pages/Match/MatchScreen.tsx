import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { AppRoutes } from 'app/constants';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Image, Dimensions, Alert, ScrollView } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/configure-store';
import { createRoom, doesUserHaveRoomRedux, resetMovies } from 'redux/matchSlice';
import useFetchUserProfile from 'shared/hooks/getUserProfile';
import { Color } from 'styles/colors';
import { MatchLobbyActionsSkeleton } from './components/match-lobby-actions-skeleton';
import { MatchMembershipsBlock } from './components/match-memberships-block';
import { MatchScreenLobbyActionsRow } from './components/match-screen-lobby-actions-row';

const { width } = Dimensions.get('window');

export const MatchScreen: FC = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const dispatch: AppDispatch = useDispatch();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { user, loading: userLoading } = useFetchUserProfile();

    useEffect(() => {
        dispatch(resetMovies());
    }, [dispatch]);

    const handleCreateRoom = async (userId: number | undefined) => {
        if (userId == null) {
            return;
        }
        try {
            const newRoom: any = await dispatch(createRoom(userId)).unwrap();

            await queryClient.invalidateQueries({ queryKey: ['rooms', 'my-memberships'] });
            dispatch(doesUserHaveRoomRedux(userId));

            navigation.navigate(AppRoutes.MATCH_NAVIGATOR, {
                screen: AppRoutes.MATCH_LOBBY,
                params: { lobbyName: newRoom.roomKey },
            });
        } catch (errMsg) {
            const message = typeof errMsg === 'string' ? errMsg : String(errMsg);
            Alert.alert(t('match_movie.main_match_screen.create_lobby_btn'), message);
        }
    };

    const userReady = Boolean(user?.id && !userLoading);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerContainer}>
                    <Text
                        style={[
                            styles.text,
                            {
                                fontSize: 24,
                                fontWeight: '700',
                                lineHeight: 28.8,
                            },
                        ]}
                    >
                        {t('match_movie.main_match_screen.greetings')}, {user ? user.username : 'Username'}!
                    </Text>
                </View>
                <View style={styles.mainContainer}>
                    <Image style={{ height: 220, marginBottom: 16 }} source={require('../../../assets/image41.png')} />
                    <Text
                        style={[
                            styles.text,
                            {
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: '400',
                                lineHeight: 20.8,
                            },
                        ]}
                    >
                        {t('match_movie.main_match_screen.main_text')}
                    </Text>
                </View>
                <View style={styles.controlsContainer}>
                    {userLoading && !user ? (
                        <MatchLobbyActionsSkeleton />
                    ) : (
                        <>
                            <MatchScreenLobbyActionsRow
                                createTitle={t('match_movie.main_match_screen.create_lobby_btn')}
                                joinTitle={t('match_movie.main_match_screen.join_lobby_btn')}
                                onCreate={() => void handleCreateRoom(user?.id)}
                                onJoin={() =>
                                    navigation.navigate(AppRoutes.MATCH_NAVIGATOR, {
                                        screen: AppRoutes.MATCH_JOIN_LOBBY,
                                    })
                                }
                                createDisabled={userLoading || user?.id == null}
                                joinDisabled={userLoading}
                            />
                            <MatchMembershipsBlock userId={user?.id} userReady={userReady} />
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.BACKGROUND_GREY,
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingBottom: 48,
    },
    headerContainer: {
        width: width,
        paddingLeft: 16,
        marginBottom: 8,
    },
    mainContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: width - 32,
        marginBottom: 16,
    },
    controlsContainer: {
        alignSelf: 'stretch',
        alignItems: 'center',
        marginBottom: 16,
    },
    text: {
        color: Color.WHITE,
    },
});
