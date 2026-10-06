import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { CommonMovieRef } from 'features/match/match.model';
import { Color } from 'styles/colors';

type MatchCommonProgressPanelProps = {
    readonly commonLabelCount: string;
    readonly commonMovies: readonly CommonMovieRef[];
    readonly showFirstCommonToast: boolean;
};

/**
 * Badge «Общих: N» / «N / 4», title list, and first-common toast (Angular match-lobby-play parity).
 */
export const MatchCommonProgressPanel: React.FC<MatchCommonProgressPanelProps> = ({
    commonLabelCount,
    commonMovies,
    showFirstCommonToast,
}) => {
    const { t } = useTranslation();

    return (
        <View style={styles.root} accessibilityLiveRegion="polite">
            {showFirstCommonToast ? (
                <View style={styles.toast} accessibilityRole="text">
                    <Text style={styles.toastText}>{t('match_movie.swipe.first_common_toast')}</Text>
                </View>
            ) : null}

            <Text style={styles.badge}>
                {t('match_movie.swipe.common_count', { count: commonLabelCount })}
            </Text>

            <View style={styles.listCard}>
                <Text style={styles.listTitle}>{t('match_movie.swipe.common_title')}</Text>
                <Text style={styles.listHint}>{t('match_movie.swipe.common_hint')}</Text>
                <ScrollView
                    style={styles.listScroll}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                >
                    {commonMovies.length === 0 ? (
                        <Text style={styles.empty}>{t('match_movie.swipe.common_empty')}</Text>
                    ) : (
                        commonMovies.map((movie) => (
                            <Text key={movie.id} style={styles.item}>
                                {movie.title}
                            </Text>
                        ))
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
        gap: 8,
        zIndex: 5,
    },
    toast: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: Color.PURPLE_DARK,
        alignItems: 'center',
    },
    toastText: {
        color: Color.WHITE,
        fontWeight: '600',
        fontSize: 14,
    },
    badge: {
        color: Color.ACCENT_2,
        fontWeight: '700',
        fontSize: 15,
    },
    listCard: {
        maxHeight: 120,
        borderRadius: 12,
        backgroundColor: Color.EXTRA_DARK_GRAY,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 4,
    },
    listTitle: {
        color: Color.WHITE,
        fontWeight: '600',
        fontSize: 14,
    },
    listHint: {
        color: Color.FADED_WHITE,
        fontSize: 12,
        marginBottom: 4,
    },
    listScroll: {
        maxHeight: 72,
    },
    item: {
        color: Color.LIGHT_GRAY,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 2,
    },
    empty: {
        color: Color.SYSTEM_GREY,
        fontSize: 13,
    },
});
