import { FC, useCallback, useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/configure-store';
import { clearMatchSession, openMatchLobby } from 'features/match/match-session';
import { doesUserHaveRoomRedux } from 'redux/matchSlice';
import type { UserRoomMembership } from 'features/match/match-service';
import { useMatchScreenMemberships } from '../hooks/useMatchScreenMemberships';
import { MatchMembershipsTable } from './match-memberships-table';

type MatchMembershipsBlockProps = {
    userId: number | undefined;
    userReady: boolean;
};

export const MatchMembershipsBlock: FC<MatchMembershipsBlockProps> = ({ userId, userReady }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const dispatch = useDispatch<AppDispatch>();
    const queryClient = useQueryClient();

    const onMembershipsChanged = useCallback(
        (leftRoomKey?: string) => {
            clearMatchSession(dispatch, queryClient, { roomKey: leftRoomKey });
            if (userId != null) {
                dispatch(doesUserHaveRoomRedux(userId));
            }
        },
        [dispatch, queryClient, userId],
    );

    const { memberships, isLoading, leaveRoom, leavingRoomKey } = useMatchScreenMemberships({
        userId,
        enabled: userReady,
        onMembershipsChanged,
    });

    const labels = useMemo(
        () => ({
            title: t('match_movie.main_match_screen.my_rooms_title'),
            columnRoom: t('match_movie.main_match_screen.column_room'),
            columnRole: t('match_movie.main_match_screen.column_role'),
            columnActions: t('match_movie.main_match_screen.column_actions'),
            roleAuthor: t('match_movie.main_match_screen.role_author'),
            roleParticipant: t('match_movie.main_match_screen.role_participant'),
            open: t('match_movie.main_match_screen.action_open'),
            leave: t('match_movie.main_match_screen.action_leave'),
            empty: t('match_movie.main_match_screen.empty_memberships'),
            emptyHint: t('match_movie.main_match_screen.empty_memberships_hint'),
        }),
        [t],
    );

    const openLobby = useCallback(
        (roomKey: string) => {
            openMatchLobby(navigation, dispatch, queryClient, roomKey);
        },
        [dispatch, navigation, queryClient],
    );

    const runLeave = useCallback(
        async (roomKey: string) => {
            try {
                await leaveRoom(roomKey);
            } catch (e) {
                const message = e instanceof Error ? e.message : String(e);
                Alert.alert(t('match_movie.main_match_screen.action_leave'), message);
            }
        },
        [leaveRoom, t],
    );

    const onRequestLeave = useCallback(
        (row: UserRoomMembership) => {
            const title = t('match_movie.main_match_screen.confirm_leave_title');
            const message = row.isAuthor
                ? t('match_movie.main_match_screen.confirm_leave_author_body')
                : t('match_movie.main_match_screen.confirm_leave_participant_body');

            Alert.alert(title, message, [
                { text: t('match_movie.main_match_screen.cancel'), style: 'cancel' },
                {
                    text: t('match_movie.main_match_screen.action_leave'),
                    style: 'destructive',
                    onPress: () => {
                        void runLeave(row.roomKey);
                    },
                },
            ]);
        },
        [runLeave, t],
    );

    return (
        <View style={styles.wrap}>
            <MatchMembershipsTable
                memberships={memberships}
                isLoading={isLoading}
                labels={labels}
                leavingRoomKey={leavingRoomKey}
                onOpenLobby={openLobby}
                onRequestLeave={onRequestLeave}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        width: '100%',
        paddingHorizontal: 16,
    },
});
