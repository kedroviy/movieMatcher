import type { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Color } from 'styles/colors';

import type { ModalBackdropProps } from './types';

export const ModalBackdrop: FC<ModalBackdropProps> = ({ children, onBackdropPress, contentStyle }) => {
    return (
        <View style={styles.root}>
            <Pressable
                style={styles.pressable}
                onPress={onBackdropPress}
                accessibilityRole="button"
                disabled={onBackdropPress === undefined}
            >
                <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.dim} />
            </Pressable>
            <Animated.View
                entering={FadeIn.duration(220)}
                exiting={FadeOut.duration(150)}
                style={[styles.content, contentStyle]}
            >
                {children}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    pressable: {
        ...StyleSheet.absoluteFillObject,
    },
    dim: {
        flex: 1,
        backgroundColor: Color.TRANSPARENT_SYSTEM_BLACK,
    },
    content: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
