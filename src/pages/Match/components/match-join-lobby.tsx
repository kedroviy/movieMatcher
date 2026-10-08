import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { AppDispatch } from 'redux/configure-store';
import { openMatchLobby } from 'features/match/match-session';
import { joinRoom } from 'redux/matchSlice';
import { AppConstants, NumericOtpInput, SimpleButton, resolveUserIdFromToken } from 'shared';
import { notifySessionExpired } from 'shared/api/session-expired';
import { Color } from 'styles/colors';
import useFetchUserProfile from 'shared/hooks/getUserProfile';
import { MovieLoader } from 'shared/ui/movie-loader';

const { width } = Dimensions.get('window');

const LOBBY_KEY_LENGTH = 6;

const isCompleteKey = (k: string): boolean => k.length === LOBBY_KEY_LENGTH && /^\d+$/.test(k);

export const MatchJoinLobby: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const queryClient = useQueryClient();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { t } = useTranslation();
    const { loading } = useSelector((state: any) => state.matchSlice);
    const { user } = useFetchUserProfile();
    const [key, setKey] = useState<string>(AppConstants.EMPTY_VALUE);
    const [resolvedUserId, setResolvedUserId] = useState<number | null>(user?.id ?? null);
    const isSubmittingRef = useRef(false);
    const lastAttemptedKeyRef = useRef<string | null>(null);

    const labels = useMemo(
        () => ({
            codeLabel: t('match_movie.main_match_screen.join_lobby_code_label'),
            submit: t('match_movie.main_match_screen.join_lobby_submit'),
            incomplete: t('match_movie.main_match_screen.join_lobby_code_incomplete'),
            joinFailed: t('match_movie.main_match_screen.join_lobby_btn'),
            sessionExpired: t('match_movie.main_match_screen.session_expired'),
            roomNotFound: t('match_movie.main_match_screen.room_not_found'),
            joinFailedBody: t('match_movie.main_match_screen.join_failed'),
        }),
        [t],
    );

    useEffect(() => {
        if (user?.id != null) {
            setResolvedUserId(user.id);
            return;
        }
        let cancelled = false;
        void (async () => {
            const userId = await resolveUserIdFromToken();
            if (!cancelled && userId != null) {
                setResolvedUserId(userId);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    const executeJoin = async (roomKey: string) => {
        if (!isCompleteKey(roomKey) || isSubmittingRef.current || loading) {
            return;
        }
        let userId = resolvedUserId ?? user?.id ?? null;
        if (userId == null) {
            userId = await resolveUserIdFromToken();
            if (userId != null) {
                setResolvedUserId(userId);
            }
        }
        if (userId == null) {
            notifySessionExpired();
            return;
        }
        isSubmittingRef.current = true;
        lastAttemptedKeyRef.current = roomKey;
        Keyboard.dismiss();
        dispatch(joinRoom({ key: roomKey, userId }))
            .unwrap()
            .then(() => {
                openMatchLobby(navigation, dispatch, queryClient, roomKey, { clearRedux: false });
            })
            .catch((errMsg) => {
                const message = typeof errMsg === 'string' ? errMsg : String(errMsg);
                lastAttemptedKeyRef.current = null;
                setKey(AppConstants.EMPTY_VALUE);
                const isSessionError =
                    message === 'SESSION_EXPIRED' ||
                    /истекла|Unauthorized|Forbidden|войдите|сессия|session/i.test(message) ||
                    message.includes('401') ||
                    message.includes('403');
                if (isSessionError) {
                    notifySessionExpired();
                    return;
                }
                const body =
                    message === 'ROOM_NOT_FOUND'
                        ? labels.roomNotFound
                        : message === 'JOIN_FAILED'
                          ? labels.joinFailedBody
                          : message;
                Alert.alert(labels.joinFailed, body);
            })
            .finally(() => {
                isSubmittingRef.current = false;
            });
    };

    useEffect(() => {
        if (!isCompleteKey(key) || resolvedUserId == null || loading) {
            return;
        }
        if (lastAttemptedKeyRef.current === key || isSubmittingRef.current) {
            return;
        }
        void executeJoin(key);
    }, [key, resolvedUserId, loading]);

    const incompleteError = key.length > 0 && !isCompleteKey(key) ? labels.incomplete : undefined;
    const canSubmit = isCompleteKey(key) && resolvedUserId != null && !loading;

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
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
                    onHandlePress={() => void executeJoin(key)}
                    disabled={!canSubmit}
                />
                {loading ? <MovieLoader /> : null}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: Color.BACKGROUND_GREY,
    },
    container: {
        backgroundColor: Color.BACKGROUND_GREY,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 32,
    },
});
