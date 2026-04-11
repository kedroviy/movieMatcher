import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type SMMovieChipsType = {
    label: string | number | null | undefined;
    color: string;
    labelColor: string;
    type?: 'time' | 'age';
};

export const SMMovieChips: FC<SMMovieChipsType> = ({ label, color, labelColor, type }) => {
    if (label === null || label === undefined) {
        return null;
    }
    if (typeof label === 'string' && label.trim() === '') {
        return null;
    }
    if (typeof label === 'number' && !Number.isFinite(label)) {
        return null;
    }

    if (type === 'time' && Number(label) <= 0) {
        return null;
    }
    if (type === 'age' && Number(label) <= 0) {
        return null;
    }

    const display = type === 'time' ? `${label} мин` : type === 'age' ? `${label}+` : String(label);

    return (
        <View style={[styles.chip, { backgroundColor: color }]}>
            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.chipText, { color: labelColor }, !type && styles.chipTextLong]}
            >
                {display}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        marginRight: 8,
        marginBottom: 4,
        maxWidth: '100%',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 16,
    },
    chipTextLong: {
        maxWidth: 160,
    },
});
