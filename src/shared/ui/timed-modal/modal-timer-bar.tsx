import type { FC } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    cancelAnimation,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { Color } from 'styles/colors';
import { radius } from 'styles/theme';

import type { ModalTimerBarProps } from './types';

export const ModalTimerBar: FC<ModalTimerBarProps> = ({ active, durationMs, onComplete }) => {
    const progress = useSharedValue(1);

    useEffect(() => {
        if (!active) {
            cancelAnimation(progress);
            progress.value = 1;
            return;
        }

        progress.value = 1;
        progress.value = withTiming(0, { duration: durationMs }, (finished: boolean) => {
            if (finished) {
                runOnJS(onComplete)();
            }
        });

        return () => {
            cancelAnimation(progress);
        };
    }, [active, durationMs, onComplete, progress]);

    const fillStyle = useAnimatedStyle(() => ({
        transform: [{ scaleX: progress.value }],
    }));

    return (
        <View style={styles.track}>
            <Animated.View style={[styles.fill, fillStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        width: '100%',
        height: 4,
        borderRadius: radius.pill,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
    },
    fill: {
        width: '100%',
        height: '100%',
        borderRadius: radius.pill,
        backgroundColor: Color.BUTTON_RED,
        transformOrigin: 'left',
    },
});
