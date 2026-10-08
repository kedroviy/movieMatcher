import { FC, useCallback, useMemo, useState } from 'react';
import { Alert, Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

import { Color } from 'styles/colors';
import { AppRoutes } from 'app/constants';

import { useTranslation } from 'react-i18next';
import { SMMovieChips } from 'pages/Main/ui/sm-movie-chips';
import { getRatingColor, roundDownToOneTenth } from 'pages/Main/utils';
import { resolveMoviePosterUri, resolveMovieRating, resolveMovieTitle } from 'pages/Main/utils/movie-card-media';
import { SimpleButton } from 'shared';
import { getMatchDeckDocs, resolveMatchWatchUrl } from '../utils/match-deck';

const { width } = Dimensions.get('window');

const bottomButtonGap = 12;
const horizontalPadding = 32;

type NamedItem = {
    name?: string;
};

function readChipLabel(value: unknown): string | number | null {
    if (typeof value === 'number' || typeof value === 'string') {
        return value;
    }
    return null;
}

function readNamedItems(value: unknown): NamedItem[] {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter((item): item is NamedItem => item != null && typeof item === 'object');
}

export const MatchResult: FC = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { movies } = useSelector((state: { matchSlice: { movies: unknown } }) => state.matchSlice);
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const movie = useMemo(() => getMatchDeckDocs(movies)[0], [movies]);
    const posterUri = movie ? resolveMoviePosterUri(movie.poster) : null;
    const title = movie ? resolveMovieTitle(movie) : '';
    const rating = movie ? resolveMovieRating(movie) : null;
    const description = typeof movie?.description === 'string' ? movie.description : '';
    const genres = readNamedItems(movie?.genres);
    const countries = readNamedItems(movie?.countries);
    const watchUrl = movie ? resolveMatchWatchUrl(movie) : null;

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handlePress = async () => {
        if (!watchUrl) {
            return;
        }
        try {
            await Linking.openURL(watchUrl);
        } catch {
            Alert.alert(t('prompts.url_open_failed', { url: watchUrl }));
        }
    };

    const handleExitToMatch = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: ['rooms', 'my-memberships'] });
        const rootNav = navigation.getParent();
        if (rootNav) {
            rootNav.navigate(
                AppRoutes.TAB_NAVIGATOR as never,
                {
                    screen: AppRoutes.MATCH_SCREEN,
                } as never,
            );
        }
    }, [navigation, queryClient]);

    const bottomRowWidth = width - horizontalPadding;
    const bottomButtonWidth = (bottomRowWidth - bottomButtonGap) / 2;

    if (!movie) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyState}>
                    <Text style={styles.headerText}>{t('match_movie.swipe.unavailable_title')}</Text>
                    <Text style={[styles.text, styles.emptyHint]}>{t('match_movie.swipe.unavailable_description')}</Text>
                </View>
                <SimpleButton
                    title={t('match_movie.exit_to_match_screen')}
                    color={Color.INPUT_GREY}
                    titleColor={Color.WHITE}
                    buttonWidth={bottomRowWidth}
                    onHandlePress={handleExitToMatch}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <Image
                        source={
                            posterUri
                                ? { uri: posterUri }
                                : require('../../../../assets/defaultpicture.png')
                        }
                        style={styles.poster}
                    />
                    {rating != null ? (
                        <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(rating) }]}>
                            <Text style={[styles.text, styles.ratingText]}>{roundDownToOneTenth(rating)}</Text>
                        </View>
                    ) : null}
                </View>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.chipsViewport}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <SMMovieChips
                            label={readChipLabel(movie.ageRating)}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                            type="age"
                        />
                        <SMMovieChips
                            label={readChipLabel(movie.movieLength)}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                            type="time"
                        />
                        {genres.map((genre, index) => (
                            <SMMovieChips
                                key={`genre-${genre.name ?? index}`}
                                label={genre.name}
                                color={Color.LIGHT_RED}
                                labelColor={Color.WHITE}
                            />
                        ))}
                        {countries.map((country, index) => (
                            <SMMovieChips
                                key={`country-${country.name ?? index}`}
                                label={country.name}
                                color={Color.LIGHT_RED}
                                labelColor={Color.WHITE}
                            />
                        ))}
                    </ScrollView>
                </View>
                {description ? (
                    <View style={styles.contentContainer}>
                        <Text
                            style={[styles.text, styles.description]}
                            numberOfLines={isExpanded ? undefined : 4}
                            ellipsizeMode="tail"
                        >
                            {description}
                        </Text>
                        <TouchableOpacity onPress={toggleExpanded}>
                            <Text style={styles.expandLabel}>
                                {isExpanded ? t('general.collapse') : t('general.expand')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </ScrollView>
            <View style={styles.actions}>
                <SimpleButton
                    title={t('selection_movie.movie_details.watch')}
                    color={Color.BUTTON_RED}
                    titleColor={Color.WHITE}
                    buttonWidth={bottomButtonWidth}
                    onHandlePress={handlePress}
                    disabled={!watchUrl}
                />
                <SimpleButton
                    title={t('match_movie.exit_to_match_screen')}
                    color={Color.INPUT_GREY}
                    titleColor={Color.WHITE}
                    buttonWidth={bottomButtonWidth}
                    onHandlePress={handleExitToMatch}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.BACKGROUND_GREY,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 32,
    },
    emptyState: {
        flex: 1,
        width: width - 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyHint: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 16,
    },
    poster: {
        width: width - 32,
        height: 260,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    ratingBadge: {
        position: 'absolute',
        width: 41,
        height: 30,
        paddingVertical: 2,
        paddingHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        right: 12,
        top: 16,
    },
    ratingText: {
        fontSize: 14,
    },
    title: {
        color: Color.WHITE,
        fontFamily: 'Roboto',
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28.8,
        paddingVertical: 24,
        width: width - 32,
    },
    chipsViewport: {
        width: width - 32,
    },
    contentContainer: {
        width: width - 32,
        marginVertical: 16,
        borderRadius: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 5,
    },
    expandLabel: {
        color: Color.GREY,
        fontSize: 16,
    },
    actions: {
        flexDirection: 'row',
        width: width - horizontalPadding,
        justifyContent: 'space-between',
    },
    text: {
        color: Color.WHITE,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28.8,
        color: Color.WHITE,
        textAlign: 'center',
    },
});
