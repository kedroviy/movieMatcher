import { FC, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Color } from 'styles/colors';
import { radius } from 'styles/theme';

/**
 * Placeholder row while profile loads — matches `MatchScreenLobbyActionsRow` layout
 * so the switch to real buttons does not jump. Subtle pulse instead of swapping label text.
 *
 * Keep `row` / `slot` / `pill` metrics in sync with `match-screen-lobby-actions-row.tsx`.
 */
export const MatchLobbyActionsSkeleton: FC = () => {
    const opacity = useRef(new Animated.Value(0.38)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.72,
                    duration: 700,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.38,
                    duration: 700,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [opacity]);

    return (
        <View style={styles.row} accessibilityRole="progressbar" accessibilityLabel="Loading actions">
            <View style={styles.slot}>
                <Animated.View style={[styles.pill, { opacity }]} />
            </View>
            <View style={styles.slot}>
                <Animated.View style={[styles.pillMuted, { opacity }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        width: '100%',
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 10,
        marginBottom: 12,
    },
    slot: {
        flex: 1,
        minWidth: 0,
    },
    pill: {
        width: '100%',
        minHeight: 52,
        borderRadius: radius.md,
        backgroundColor: Color.GRAY_BROWN,
    },
    pillMuted: {
        width: '100%',
        minHeight: 52,
        borderRadius: radius.md,
        backgroundColor: Color.INPUT_GREY,
        borderWidth: 1,
        borderColor: Color.GREY,
    },
});
