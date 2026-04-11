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
        emptyHint: string;
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
            <View style={styles.section}>
                <View style={styles.titleRow}>
                    <View style={styles.titleAccent} />
                    <Text style={styles.sectionTitle}>{labels.title}</Text>
                </View>
                <View style={styles.loaderWrap}>
                    <ActivityIndicator color={Color.ACCENT_2} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.section}>
            <View style={styles.glowOrb} />
            <View style={styles.glowOrbSecondary} />

            <View style={styles.titleRow}>
                <View style={styles.titleAccent} />
                <Text style={styles.sectionTitle}>{labels.title}</Text>
            </View>

            {memberships.length === 0 ? (
                <View style={styles.emptyCard}>
                    <View style={styles.emptyBlobA} />
                    <View style={styles.emptyBlobB} />
                    <View style={styles.emptyBlobC} />
                    <Text style={styles.emptyIcon} accessibilityLabel="">
                        🎬
                    </Text>
                    <Text style={styles.emptyTitle}>{labels.empty}</Text>
                    <Text style={styles.emptyHint}>{labels.emptyHint}</Text>
                </View>
            ) : (
                <View style={styles.cardList}>
                    {memberships.map((row) => {
                        const roleLabel = row.isAuthor ? labels.roleAuthor : labels.roleParticipant;
                        const busy = leavingRoomKey === row.roomKey;
                        return (
                            <View key={`${row.roomKey}-${row.roomId}`} style={styles.roomCard}>
                                <View style={styles.roomCardHeader}>
                                    <Text style={styles.roomKey} numberOfLines={1}>
                                        #{row.roomKey}
                                    </Text>
                                    <View
                                        style={[
                                            styles.rolePill,
                                            row.isAuthor ? styles.rolePillHost : styles.rolePillGuest,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.rolePillText,
                                                row.isAuthor ? styles.rolePillTextHost : undefined,
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {roleLabel}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.cardActions}>
                                    <TouchableOpacity
                                        style={[styles.primaryBtn, busy && styles.btnDisabled]}
                                        onPress={() => onOpenLobby(row.roomKey)}
                                        disabled={busy}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={styles.primaryBtnText}>{labels.open}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.ghostBtn, busy && styles.btnDisabled]}
                                        onPress={() => onRequestLeave(row)}
                                        disabled={busy}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={styles.ghostBtnText}>{labels.leave}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: Color.NEW_BLACK,
        borderWidth: 1,
        borderColor: 'rgba(250,250,250,0.06)',
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    glowOrb: {
        position: 'absolute',
        top: -48,
        right: -32,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: Color.ACCENT,
        opacity: 0.07,
    },
    glowOrbSecondary: {
        position: 'absolute',
        bottom: -60,
        left: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Color.ACCENT_2,
        opacity: 0.06,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
        zIndex: 1,
    },
    titleAccent: {
        width: 4,
        height: 22,
        borderRadius: 2,
        backgroundColor: Color.ACCENT_2,
    },
    sectionTitle: {
        color: Color.WHITE,
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    loaderWrap: {
        paddingVertical: 28,
        alignItems: 'center',
        zIndex: 1,
    },
    cardList: {
        gap: 12,
        zIndex: 1,
    },
    roomCard: {
        borderRadius: 16,
        padding: 14,
        backgroundColor: 'rgba(36,36,40,0.92)',
        borderWidth: 1,
        borderColor: 'rgba(250,250,250,0.07)',
    },
    roomCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 14,
    },
    roomKey: {
        flex: 1,
        minWidth: 0,
        color: Color.WHITE,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    rolePill: {
        maxWidth: '46%',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
    },
    rolePillHost: {
        backgroundColor: 'rgba(129,140,248,0.18)',
        borderColor: 'rgba(129,140,248,0.45)',
    },
    rolePillGuest: {
        backgroundColor: 'rgba(250,250,250,0.06)',
        borderColor: 'rgba(250,250,250,0.12)',
    },
    rolePillText: {
        color: Color.FADED_WHITE,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    rolePillTextHost: {
        color: Color.ACCENT_2,
    },
    cardActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    primaryBtn: {
        flex: 1,
        minWidth: 120,
        paddingVertical: 11,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: Color.BUTTON_RED,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ghostBtn: {
        paddingVertical: 11,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(250,250,250,0.18)',
        backgroundColor: 'rgba(250,250,250,0.04)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        color: Color.WHITE,
        fontSize: 14,
        fontWeight: '700',
    },
    ghostBtnText: {
        color: Color.WHITE,
        fontSize: 14,
        fontWeight: '600',
    },
    btnDisabled: {
        opacity: 0.45,
    },
    emptyCard: {
        minHeight: 168,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(250,250,250,0.06)',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(36,36,40,0.5)',
        paddingVertical: 22,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    emptyBlobA: {
        position: 'absolute',
        top: 12,
        left: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Color.ACCENT,
        opacity: 0.1,
    },
    emptyBlobB: {
        position: 'absolute',
        bottom: 18,
        right: 20,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Color.ACCENT_2,
        opacity: 0.14,
    },
    emptyBlobC: {
        position: 'absolute',
        top: 40,
        right: 36,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Color.WHITE,
        opacity: 0.08,
    },
    emptyIcon: {
        fontSize: 36,
        marginBottom: 10,
    },
    emptyTitle: {
        color: Color.WHITE,
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 8,
    },
    emptyHint: {
        color: Color.SYSTEM_GREY,
        fontSize: 13,
        fontWeight: '400',
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 300,
    },
});
