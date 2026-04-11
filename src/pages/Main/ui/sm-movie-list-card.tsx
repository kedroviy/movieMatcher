import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';

import { Movie } from 'features';
import { OnboardingPagination } from 'pages/Onboarding/ui';
import { ChevronRightSVGIcon } from 'shared';
import { Color } from 'styles/colors';
import { contentWidth, borderSubtle, radius, shadowCard, spacing } from 'styles/theme';
import { SMCard } from './sm-card';

interface MovieCardProps {
    id: string;
    label: string;
    moviesCount: number;
    onHandlePress: () => void;
    movies: Movie[];
}

const PAGE_GAP = 0;

export const MovieCard: React.FC<MovieCardProps> = ({ id, label, movies = [], moviesCount, onHandlePress }) => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const preview = movies.slice(0, 3);
    const pageWidth = contentWidth + PAGE_GAP;

    const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
        const scrollOffset = event.nativeEvent.contentOffset.x;
        const newPageIndex = Math.round(scrollOffset / pageWidth);
        setCurrentPage(newPageIndex);
    };

    const totalDots = preview.length >= 2 ? preview.length : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleBlock}>
                    <Text style={styles.titleLine} numberOfLines={1}>
                        <Text style={styles.kicker}>Подборка </Text>
                        <Text style={styles.titleHash}>#{label}</Text>
                    </Text>
                    {moviesCount > 0 ? (
                        <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>{moviesCount}</Text>
                        </View>
                    ) : null}
                </View>
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Открыть всю подборку"
                    onPress={onHandlePress}
                    style={styles.allButton}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                >
                    <Text style={styles.allButtonText}>Все</Text>
                    <ChevronRightSVGIcon />
                </TouchableOpacity>
            </View>
            <View style={styles.cardOuter}>
                <View style={styles.cardInner}>
                    <ScrollView
                        style={styles.scrollView}
                        horizontal
                        pagingEnabled
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate="fast"
                        snapToInterval={pageWidth}
                        snapToAlignment="start"
                        disableIntervalMomentum
                        contentContainerStyle={styles.scrollContent}
                    >
                        {preview.map((movie) => (
                            <View key={`${id}-${movie.id}`} style={[styles.page, { width: pageWidth }]}>
                                <SMCard movie={movie} />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <View style={styles.paginationWrap}>
                <OnboardingPagination totalPages={totalDots} currentPage={currentPage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 255,
        width: contentWidth,
        marginBottom: spacing.lg,
        flexDirection: 'column',
    },
    header: {
        minHeight: 32,
        flexShrink: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingHorizontal: 2,
    },
    titleBlock: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.sm,
        minWidth: 0,
    },
    titleLine: {
        flexShrink: 1,
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 20.8,
        color: Color.WHITE,
    },
    kicker: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.4,
        color: Color.FADED_WHITE,
    },
    titleHash: {
        fontSize: 15,
        fontWeight: '700',
        color: Color.WHITE,
    },
    countBadge: {
        marginLeft: 8,
        minWidth: 24,
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: radius.pill,
        backgroundColor: 'rgba(220, 38, 38, 0.22)',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(220, 38, 38, 0.45)',
    },
    countBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: Color.WHITE,
        textAlign: 'center',
    },
    allButton: {
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingLeft: 12,
        paddingRight: 8,
        borderRadius: radius.pill,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: borderSubtle,
    },
    allButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: Color.WHITE,
    },
    cardOuter: {
        flex: 1,
        minHeight: 0,
        borderRadius: radius.lg + 2,
        padding: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 18,
            },
            android: { elevation: 8 },
            default: {},
        }),
    },
    cardInner: {
        flex: 1,
        width: contentWidth,
        marginVertical: spacing.xs,
        backgroundColor: Color.GRAY_BROWN,
        borderRadius: radius.lg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: borderSubtle,
        overflow: 'hidden',
        ...shadowCard,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'stretch',
    },
    page: {
        alignSelf: 'stretch',
    },
    paginationWrap: {
        flexShrink: 0,
        paddingTop: 2,
    },
});
