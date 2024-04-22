import { Movie } from 'features';
import { OnboardingPagination } from 'pages/Onboarding/ui';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { ChevronRightSVGIcon } from 'shared';
import { Color } from 'styles/colors';
import { SMMovieChips } from './sm-movie-chips';

interface MovieCardProps {
    id: string;
    label: string;
    moviesCount: number;
    onHandlePress: () => void;
    movies: Movie[];
}

const { width } = Dimensions.get('window');

export const MovieCard: React.FC<MovieCardProps> = ({ id, label, moviesCount, movies = [], onHandlePress }) => {
    const [currentPage, setCurrentPage] = useState<number>(0);


    const handleScroll = (event: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
        const scrollOffset = event.nativeEvent.contentOffset.x;
        const pageWidth = width - 32;
        const newPageIndex = Math.floor(scrollOffset / pageWidth) + 1;

        setCurrentPage(newPageIndex);
    };

    function roundDownToOneTenth(num: number) {
        return Math.floor(num * 10) / 10;
    }

    const getRatingColor = (rating: number) => {
        if (rating >= 7) return Color.GREEN;
        if (rating >= 5) return Color.INPUT_GREY;
        return Color.BUTTON_RED;
    }

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
                >
                    {movies.slice(0, 3).map((movie, index) => (
                        <View key={index} style={styles.movieItem}>
                            <View style={styles.poster}>
                                <Image
                                    source={
                                        movie.poster ? { uri: movie.poster.previewUrl } : require('../../../../assets/defaultpicture.png')
                                    }
                                    style={{
                                        width: 99,
                                        height: '100%',
                                        resizeMode: 'cover',
                                        borderRadius: 10,
                                    }}
                                />
                                <View style={{
                                    position: 'absolute',
                                    width: 30,
                                    height: 20,
                                    paddingVertical: 2,
                                    paddingHorizontal: 4,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: getRatingColor(movie.rating.kp),
                                    borderRadius: 5,
                                    right: 5,
                                    top: 5,
                                }}>
                                    <Text style={[
                                        styles.text, {
                                            fontSize: 12,
                                        }]}>
                                        {roundDownToOneTenth(movie.rating.kp)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.movieDescription}>
                                <View style={styles.movieDescriptionText}>
                                    <Text style={[
                                        styles.text,
                                        {
                                            fontSize: 16,
                                            fontWeight: '700',
                                            lineHeight: 19.2,
                                            marginBottom: 5,
                                        }
                                    ]}>
                                        {movie.name}
                                    </Text>
                                    <Text style={[
                                        styles.text,
                                        {
                                            fontSize: 14,
                                            fontWeight: '400',
                                            lineHeight: 15.6,
                                            flexShrink: 1,
                                        }
                                    ]}
                                        numberOfLines={5}
                                        ellipsizeMode="tail"
                                    >
                                        {movie.description}
                                    </Text>
                                </View>
                                <View style={styles.footer}>
                                    <SMMovieChips
                                        label={movie.ageRating}
                                        color={Color.LIGHT_RED}
                                        labelColor={Color.WHITE}
                                        type="age"
                                    />
                                    <SMMovieChips
                                        label={movie.movieLength}
                                        color={Color.LIGHT_RED}
                                        labelColor={Color.WHITE}
                                        type="time"
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <OnboardingPagination
                totalPages={3}
                currentPage={currentPage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 251,
        width: width - 32,
        marginVertical: 32,
    },
    header: {
        width: '100%',
        height: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '70%',
        height: '30%',
        paddingBottom: 24,
    },
    poster: {
        height: '100%',
        borderRadius: 10
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
        marginRight: 10,
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
    },
    image: {
        width: 99,
        height: 177,
        resizeMode: 'cover',
    }
});
