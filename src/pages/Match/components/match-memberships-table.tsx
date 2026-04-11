import { FC } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { UserRoomMembership } from 'features/match/match-service';
import { Color } from 'styles/colors';

type MatchMembershipsTableProps = {
    memberships: UserRoomMembership[];
    isLoading: boolean;
    labels: {
        title: string;
        columnRoom: string;
        columnRole: string;
        columnActions: string;
        roleAuthor: string;
        roleParticipant: string;
        open: string;
        leave: string;
        empty: string;
    };
    leavingRoomKey: string | null;
    onOpenLobby: (roomKey: string) => void;
    onRequestLeave: (row: UserRoomMembership) => void;
};

export const MatchMembershipsTable: FC<MatchMembershipsTableProps> = ({
    memberships,
    isLoading,
    labels,
    leavingRoomKey,
    onOpenLobby,
    onRequestLeave,
}) => {
    if (isLoading && memberships.length === 0) {
        return (
            <View style={styles.loaderWrap}>
                <ActivityIndicator color={Color.WHITE} />
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{labels.title}</Text>

            <View style={styles.headerRow}>
                <Text style={[styles.cell, styles.headerCell, styles.colRoom]}>{labels.columnRoom}</Text>
                <Text style={[styles.cell, styles.headerCell, styles.colRole]}>{labels.columnRole}</Text>
                <Text style={[styles.cell, styles.headerCell, styles.colActions]}>{labels.columnActions}</Text>
            </View>

            {memberships.length === 0 ? (
                <Text style={styles.empty}>{labels.empty}</Text>
            ) : (
                memberships.map((row) => {
                    const roleLabel = row.isAuthor ? labels.roleAuthor : labels.roleParticipant;
                    const busy = leavingRoomKey === row.roomKey;
                    return (
                        <View key={`${row.roomKey}-${row.roomId}`} style={styles.dataRow}>
                            <Text style={[styles.cell, styles.colRoom]} numberOfLines={1}>
                                #{row.roomKey}
                            </Text>
                            <Text style={[styles.cell, styles.colRole]} numberOfLines={1}>
                                {roleLabel}
                            </Text>
                            <View style={[styles.cell, styles.colActions, styles.actionsWrap]}>
                                <TouchableOpacity
                                    onPress={() => onOpenLobby(row.roomKey)}
                                    style={styles.actionBtn}
                                    disabled={busy}
                                >
                                    <Text style={styles.actionText}>{labels.open}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => onRequestLeave(row)}
                                    style={[styles.actionBtn, styles.actionBtnDanger]}
                                    disabled={busy}
                                >
                                    <Text style={styles.actionText}>{labels.leave}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
    },
    title: {
        color: Color.WHITE,
        fontSize: 15,
        fontWeight: '600',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.15)',
    },
    dataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
        minHeight: 48,
    },
    cell: {
        color: Color.WHITE,
        fontSize: 13,
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    headerCell: {
        fontWeight: '700',
        fontSize: 12,
    },
    colRoom: {
        flex: 1.1,
    },
    colRole: {
        flex: 0.9,
    },
    colActions: {
        flex: 1.4,
    },
    actionsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        alignItems: 'center',
    },
    actionBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    actionBtnDanger: {
        backgroundColor: 'rgba(220,53,69,0.35)',
    },
    actionText: {
        color: Color.WHITE,
        fontSize: 12,
        fontWeight: '500',
    },
    empty: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 13,
        padding: 16,
    },
    loaderWrap: {
        paddingVertical: 24,
        alignItems: 'center',
    },
});
