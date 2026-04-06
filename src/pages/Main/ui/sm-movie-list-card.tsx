import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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

export const MovieCard: React.FC<MovieCardProps> = ({ id, label, movies = [], onHandlePress }) => {
    const [currentPage, setCurrentPage] = useState<number>(0);

    const handleScroll = (event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
        const scrollOffset = event.nativeEvent.contentOffset.x;
        const pageWidth = contentWidth + 10;
        const newPageIndex = Math.round(scrollOffset / pageWidth);

        setCurrentPage(newPageIndex);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.text, { fontSize: 16, fontWeight: '500', lineHeight: 20.8 }]}
                >
                    Подборка # {label}
                </Text>
                <TouchableOpacity
                    key={id}
                    onPress={onHandlePress}
                    style={{
                        flexDirection: 'row',
                        width: '20%',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}
                >
                    <Text
                        style={[styles.text, { fontSize: 18, fontWeight: '400', lineHeight: 20.8 }]}
                    >Все
                    </Text>
                    <ChevronRightSVGIcon />
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                <ScrollView
                    horizontal
                    pagingEnabled={true}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                >
                    {movies.slice(0, 3).map((movie, index) => (
                        <SMCard key={index} movie={movie} />
                    ))}
                </ScrollView>
            </View>
            <OnboardingPagination
                totalPages={movies.length > 3 ? 3 : (movies.length >= 2 ? movies.length : 0)}
                currentPage={currentPage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 255,
        width: contentWidth,
        marginBottom: spacing.lg,
    },
    header: {
        width: '100%',
        height: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    card: {
        width: contentWidth,
        height: 203,
        marginVertical: spacing.xs,
        backgroundColor: Color.GRAY_BROWN,
        borderRadius: radius.lg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: borderSubtle,
        overflow: 'hidden',
        ...shadowCard,
    },
    text: {
        color: Color.WHITE
    },
});
