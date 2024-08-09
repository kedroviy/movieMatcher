import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';

import { Movie } from 'features';
import { OnboardingPagination } from 'pages/Onboarding/ui';
import { ChevronRightSVGIcon } from 'shared';
import { Color } from 'styles/colors';
import { SMCard } from './sm-card';

interface MovieCardProps {
    id: string;
    label: string;
    moviesCount: number;
    onHandlePress: () => void;
    movies: Movie[];
}

const { width } = Dimensions.get('window');

export const MovieCard: React.FC<MovieCardProps> = ({ id, label, movies = [], onHandlePress }) => {
    const [currentPage, setCurrentPage] = useState<number>(0);

    const handleScroll = (event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
        const scrollOffset = event.nativeEvent.contentOffset.x;
        const pageWidth = width - 32 + 10;
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
        width: width - 32,
        marginVertical: 24,
    },
    header: {
        width: '100%',
        height: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    card: {
        width: width - 32,
        height: 203,
        marginVertical: 5,
        backgroundColor: Color.GRAY_BROWN,
        borderRadius: 5
    },
    text: {
        color: Color.WHITE
    },
    movieItem: {
        width: width - 32,
        flexDirection: 'row',
    },
    movieDescription: {
        width: '90%',
        height: '90%',
        paddingHorizontal: 12,
    },
    movieDescriptionText: {
        width: '78%',
        height: '80%',
        paddingVertical: 12,
        overflow: 'hidden',
    }
});
