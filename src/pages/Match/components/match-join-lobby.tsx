import { FC, useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AppRoutes } from 'app/constants';
import { AppDispatch } from 'redux/configure-store';
import { joinRoom } from 'redux/matchSlice';
import { AppConstants, NumericOtpInput, SimpleButton } from 'shared';
import { Color } from 'styles/colors';
import useFetchUserProfile from 'shared/hooks/getUserProfile';
import { MovieLoader } from 'shared/ui/movie-loader';

const { width } = Dimensions.get('window');

const LOBBY_KEY_LENGTH = 6;

const isCompleteKey = (k: string) => k.length === LOBBY_KEY_LENGTH && /^\d+$/.test(k);

export const MatchJoinLobby: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { t } = useTranslation();
    const { loading, room } = useSelector((state: any) => state.matchSlice);
    const { user } = useFetchUserProfile();
    const [key, setKey] = useState<string>(AppConstants.EMPTY_VALUE);

    const labels = useMemo(
        () => ({
            codeLabel: t('match_movie.main_match_screen.join_lobby_code_label'),
            submit: t('match_movie.main_match_screen.join_lobby_submit'),
            incomplete: t('match_movie.main_match_screen.join_lobby_code_incomplete'),
        }),
        [t],
    );

    useEffect(() => {
        if (room?.roomKey && !loading) {
            navigation.navigate(AppRoutes.MATCH_NAVIGATOR, {
                screen: AppRoutes.MATCH_LOBBY,
                params: { lobbyName: room.roomKey },
            });
        }
    }, [loading, navigation, room?.roomKey]);

    const onHandleSubmit = () => {
        const userId = user?.id;
        if (userId == null || !isCompleteKey(key)) {
            return;
        }
        dispatch(joinRoom({ key, userId }))
            .unwrap()
            .then(() => {
                navigation.navigate(AppRoutes.MATCH_NAVIGATOR, {
                    screen: AppRoutes.MATCH_LOBBY,
                    params: { lobbyName: key },
                });
            })
            .catch((errMsg) => {
                console.error('Error joining room:', errMsg);
            });
    };

    const incompleteError = key.length > 0 && !isCompleteKey(key) ? labels.incomplete : undefined;

    return (
        <View style={styles.container}>
            <NumericOtpInput
                length={LOBBY_KEY_LENGTH}
                label={labels.codeLabel}
                value={key}
                onChangeText={setKey}
                errorText={incompleteError}
                disabled={loading}
            />
            <SimpleButton
                title={labels.submit}
                color={Color.BUTTON_RED}
                titleColor={Color.WHITE}
                buttonWidth={width - 32}
                onHandlePress={() => onHandleSubmit()}
                disabled={loading || !isCompleteKey(key) || user?.id == null}
            />
            {loading ? <MovieLoader /> : null}
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
});
