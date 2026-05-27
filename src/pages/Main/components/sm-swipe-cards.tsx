import React, { FC, useState } from 'react';
import { Text, StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { Color } from '../../../styles/colors';
import { getRatingColor, roundDownToOneTenth } from '../utils';
import { SMMovieChips } from '../ui/sm-movie-chips';

type SMSwipeCardType = {
    card: any;
};

const { width } = Dimensions.get('window');

export const SMSwipeCards: FC<SMSwipeCardType> = ({ card }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const descriptionHeight = useSharedValue(80);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(descriptionHeight.value, {
                duration: 300,
            }),
        };
    });

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
        descriptionHeight.value = isExpanded ? 80 : 200;
    };

    if (!card || typeof card !== 'object') {
        return (
            <View style={styles.card}>
                <View style={[styles.placeholder, styles.placeholderUnavailable]}>
                    <Text style={styles.unavailableTitle}>
                        {t('match_movie.swipe.unavailable_title')}
                    </Text>
                </View>
                <View style={styles.movieDescriptionContainer}>
                    <Text style={styles.headerText}>{t('match_movie.swipe.unavailable_title')}</Text>
                    <Text style={[styles.text, { fontSize: 16 }]}>
                        {t('match_movie.swipe.unavailable_description')}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            {card?.poster ? (
                <>
                    <Image
                        style={styles.image}
                        source={{ uri: card?.poster?.previewUrl ?? './defaultpicture.png' }}
                        resizeMode="cover"
                    />
                    <View
                        style={{
                            position: 'absolute',
                            width: 41,
                            height: 30,
                            paddingVertical: 2,
                            paddingHorizontal: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: getRatingColor(card.rating?.kp),
                            borderRadius: 5,
                            right: 12,
                            top: 16,
                        }}
                    >
                        <Text
                            style={[
                                styles.text,
                                {
                                    fontSize: 14,
                                },
                            ]}
                        >
                            {roundDownToOneTenth(card.rating?.kp)}
                        </Text>
                    </View>
                </>
            ) : (
                <View style={styles.placeholder} />
            )}
            <View style={styles.movieDescriptionContainer}>
                <Text style={styles.headerText}>{`${card?.name}  (${card?.year})`}</Text>
                <View style={styles.chipsRow}>
                    {card?.ageRating != null && Number(card.ageRating) > 0 ? (
                        <SMMovieChips
                            label={card.ageRating}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                            type="age"
                        />
                    ) : null}
                    {card?.movieLength != null && Number(card.movieLength) > 0 ? (
                        <SMMovieChips
                            label={card.movieLength}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                            type="time"
                        />
                    ) : null}
                    {card?.countries?.[0]?.name ? (
                        <SMMovieChips label={card.countries[0].name} color={Color.LIGHT_RED} labelColor={Color.WHITE} />
                    ) : null}
                    {card?.genres?.[0]?.name ? (
                        <SMMovieChips label={card.genres[0].name} color={Color.LIGHT_RED} labelColor={Color.WHITE} />
                    ) : null}
                </View>
                <Animated.View style={animatedStyle}>
                    <Text
                        style={[styles.text, { fontSize: 16 }]}
                        numberOfLines={isExpanded ? undefined : 4}
                        ellipsizeMode="tail"
                    >
                        {card?.description}
                    </Text>
                </Animated.View>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={{ color: Color.GREY, fontSize: 16 }}>{isExpanded ? 'Свернуть' : 'Развернуть'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        height: 550,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        bottom: 30,
        backgroundColor: Color.BACKGROUND_GREY,
    },
    image: {
        flex: 0.88,
        bottom: 24,
        width: '100%',
        borderRadius: 10,
    },
    placeholder: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flex: 1,
        width: '100%',
        backgroundColor: Color.NEW_BLACK,
    },
    placeholderUnavailable: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    unavailableTitle: {
        color: Color.WHITE,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'flex-start',
        width: '100%',
        maxWidth: width - 32,
        marginVertical: 12,
        paddingRight: 4,
    },
    movieDescriptionContainer: {
        gap: 8,
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
        // paddingH: 12,
        left: 0,
        // bottom: 20,
        backgroundColor: Color.BACKGROUND_GREY,
        borderRadius: 10,
    },
    headerText: {
        color: Color.WHITE,
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 28.8,
    },
    text: {
        textAlign: 'left',
        color: Color.WHITE,
        fontFamily: 'Roboto',
    },
});
