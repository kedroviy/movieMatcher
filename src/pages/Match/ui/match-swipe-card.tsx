import React, { FC, useState } from 'react';
import { Text, StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Color } from "../../../styles/colors";
import { SMMovieChips } from 'pages/Main/ui/sm-movie-chips';
import { getRatingColor, roundDownToOneTenth } from 'pages/Main/utils';

type SMSwipeCardType = {
    card: any,
}

const { width } = Dimensions.get('window');

export const MatchSwipeCards: FC<SMSwipeCardType> = ({ card }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const descriptionHeight = useSharedValue(80);

    console.log('card: ', card);

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


    return (
        <View style={styles.card}>
            {card?.poster ? (
                <><Image
                    style={styles.image}
                    source={{ uri: card?.poster?.previewUrl ?? './defaultpicture.png' }}
                    resizeMode="cover" />
                    <View style={{
                        position: 'absolute',
                        width: 41,
                        height: 30,
                        paddingVertical: 2,
                        paddingHorizontal: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: getRatingColor(card.rating.kp),
                        borderRadius: 5,
                        right: 12,
                        top: 16,
                    }}>
                        <Text style={[
                            styles.text, {
                                fontSize: 14,
                            }
                        ]}>
                            {roundDownToOneTenth(card.rating.kp)}
                        </Text>
                    </View></>
            ) : (
                <View style={styles.placeholder} />
            )}
            <View style={styles.movieDescriptionContainer}>
                <Text style={styles.headerText}>
                    {`${card?.name}  (${card?.year})`}
                </Text>
                <View style={{ flexDirection: 'row', width: width - 32, marginVertical: 12, }}>

                    <SMMovieChips
                        label={card?.ageRating ?? 'unknown'}
                        color={Color.LIGHT_RED}
                        labelColor={Color.WHITE}
                        type="age"
                    />
                    <SMMovieChips
                        label={card?.movieLength ?? 'unknown'}
                        color={Color.LIGHT_RED}
                        labelColor={Color.WHITE}
                        type="time"
                    />
                    {card?.countries && (
                        <SMMovieChips
                            label={card.countries[0].name}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                        />
                    )}
                    {card?.genres && (
                        <SMMovieChips
                            label={card.genres[0].name}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                        />
                    )}
                    {card?.releaseYears && (
                        <SMMovieChips
                            label={`${card.releaseYears[0].start}-${card.releaseYears[0].end}`}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                        />
                    )}

                </View>
                <Animated.View style={animatedStyle}>
                    <Text
                        style={[
                            styles.text, { fontSize: 16, }
                        ]}
                        numberOfLines={isExpanded ? undefined : 4}
                        ellipsizeMode='tail'
                    >
                        {card?.description}
                    </Text>
                </Animated.View>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={{ color: Color.GREY, fontSize: 16 }}>
                        {isExpanded ? 'Свернуть' : 'Развернуть'}
                    </Text>
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
        backgroundColor: Color.NEW_BLACK
    },
    movieDescriptionContainer: {
        gap: 8,
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
        left: 0,
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
