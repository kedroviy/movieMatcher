import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color } from 'styles/colors';

export type SMMovieChipsType = {
    label: string | number | null | undefined;
    color: string;
    labelColor: string;
    type?: 'time' | 'age';
    variant?: 'solid' | 'glass';
};

export const SMMovieChips: FC<SMMovieChipsType> = ({ label, color, labelColor, type, variant = 'solid' }) => {
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

    const isGlass = variant === 'glass';

    return (
        <View
            style={[
                styles.chip,
                isGlass ? styles.chipGlass : { backgroundColor: color },
            ]}
        >
            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                    styles.chipText,
                    { color: isGlass ? Color.WHITE : labelColor },
                    !type && styles.chipTextLong,
                ]}
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
        borderRadius: 999,
        marginRight: 8,
        marginBottom: 4,
        maxWidth: '100%',
    },
    chipGlass: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.14)',
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
