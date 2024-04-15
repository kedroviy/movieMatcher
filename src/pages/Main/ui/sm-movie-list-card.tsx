import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Color } from 'styles/colors';

interface MovieCardProps {
    id: string;
    label: string;
    moviesCount: number;
    onHandlePress: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ id, label, moviesCount, onHandlePress }) => {
    return (
        <TouchableOpacity key={id} onPress={onHandlePress} style={styles.card}>
            <Text key={id} style={[styles.text, { fontSize: 16, lineHeight: 19.2, fontWeight: '700' }]}>{label}</Text>
            <Text style={styles.text}>{moviesCount} фильмов</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: Color.DESCRIPTION_GREY,
        borderRadius: 5
    },
    text: {
        color: Color.WHITE
    }
});
