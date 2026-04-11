import { Movie } from 'features';
import { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Color } from 'styles/colors';
import { contentWidth, radius } from 'styles/theme';
import { SMMovieChips } from './sm-movie-chips';
import { getRatingColor, roundDownToOneTenth } from '../utils';

export interface MovieCardItemProps {
    movie: Movie;
}

export const SMCard: FC<MovieCardItemProps> = ({ movie }) => {
    return (
        <View style={styles.movieItem}>
            <View style={styles.poster}>
                <Image
                    source={
                        movie.poster
                            ? { uri: movie.poster.previewUrl }
                            : require('../../../../assets/defaultpicture.png')
                    }
                    style={{
                        width: 99,
                        height: '100%',
                        resizeMode: 'cover',
                        borderRadius: radius.sm,
                    }}
                />
                <View
                    style={{
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
                    }}
                >
                    <Text
                        style={[
                            styles.text,
                            {
                                fontSize: 12,
                            },
                        ]}
                    >
                        {roundDownToOneTenth(movie.rating.kp)}
                    </Text>
                </View>
            </View>
            <View style={styles.movieDescription}>
                <View style={styles.movieDescriptionText}>
                    <Text
                        style={[
                            styles.text,
                            {
                                fontSize: 16,
                                fontWeight: '700',
                                lineHeight: 19.2,
                                marginBottom: 5,
                            },
                        ]}
                    >
                        {movie.name}
                    </Text>
                    <Text
                        style={[
                            styles.text,
                            {
                                fontSize: 14,
                                fontWeight: '400',
                                lineHeight: 15.6,
                                flexShrink: 1,
                            },
                        ]}
                        numberOfLines={5}
                        ellipsizeMode="tail"
                    >
                        {movie.description}
                    </Text>
                </View>
                <View style={styles.footer}>
                    <SMMovieChips label={movie.ageRating} color={Color.LIGHT_RED} labelColor={Color.WHITE} type="age" />
                    <SMMovieChips
                        label={movie.movieLength}
                        color={Color.LIGHT_RED}
                        labelColor={Color.WHITE}
                        type="time"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'flex-start',
        paddingTop: 4,
        paddingBottom: 8,
        paddingRight: 4,
    },
    poster: {
        alignSelf: 'stretch',
        width: 99,
        borderRadius: radius.sm,
    },
    text: {
        color: Color.WHITE,
    },
    movieItem: {
        width: contentWidth,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        minHeight: 0,
    },
    movieDescription: {
        flex: 1,
        minWidth: 0,
        paddingHorizontal: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    movieDescriptionText: {
        flex: 1,
        minHeight: 0,
        paddingVertical: 10,
        paddingRight: 4,
        overflow: 'hidden',
    },
    image: {
        width: 99,
        height: 177,
        resizeMode: 'cover',
    },
});
