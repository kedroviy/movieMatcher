import React, { FC } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import { Color } from "../../../styles/colors";

type SMSwipeCardType = {
    card: any,
}
export const SMSwipeCards: FC<SMSwipeCardType> = ({ card }) => {

    return (
        <View style={styles.card}>
            {card.poster ? (
                <Image
                    style={styles.image}
                    source={{ uri: card.poster?.previewUrl }}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.placeholder} />
            )}
            <View style={styles.movieDescriptionContainer}>
                <Text style={styles.headerText}>
                    {`${card.name}  (${card.year})`}
                </Text>
                <Text style={styles.text}>
                    {card.description}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        height: 490,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.WHITE,
        borderRadius: 10,
        shadowColor: Color.BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 6,
        shadowOpacity: 0.3,
        elevation: 2,
    },
    image: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flex: 1,
        width: '100%',
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
        overflow: 'hidden',
        flexDirection: 'column',
        height: '25%',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Color.WHITE,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        left: 0,
        bottom: 0,
    },
    headerText: {
        color: Color.BLACK,
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 28.8,
    },
    text: {
        textAlign: 'left',
        fontSize: 14,
        color: Color.BLACK,
        fontFamily: 'Roboto',

    },
});
