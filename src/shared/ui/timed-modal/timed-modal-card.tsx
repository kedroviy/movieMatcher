import type { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { CrossSvgIcon } from '../icons';
import { Color } from 'styles/colors';
import { radius, spacing } from 'styles/theme';

import { CLOSE_BUTTON_HIT_SLOP, TIMED_MODAL_CARD_WIDTH } from './constants';
import { ModalTimerBar } from './modal-timer-bar';
import type { TimedModalCardProps } from './types';

export const TimedModalCard: FC<TimedModalCardProps> = ({
    title,
    description,
    closeLabel,
    timerActive,
    autoDismissMs,
    onClose,
    onTimerComplete,
    children,
    closeHitSlop = CLOSE_BUTTON_HIT_SLOP,
}) => {
    return (
        <Animated.View
            entering={SlideInDown.springify().damping(18).stiffness(200)}
            exiting={SlideOutDown.duration(200)}
            style={styles.card}
        >
            <ModalTimerBar active={timerActive} durationMs={autoDismissMs} onComplete={onTimerComplete} />

            <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={closeHitSlop}
                accessibilityRole="button"
                accessibilityLabel={closeLabel}
            >
                <CrossSvgIcon />
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            {children}

            <TouchableOpacity style={styles.primaryButton} onPress={onClose} activeOpacity={0.85}>
                <Text style={styles.primaryButtonText}>{closeLabel}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: TIMED_MODAL_CARD_WIDTH,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
        borderRadius: radius.md,
        backgroundColor: Color.NEW_BLACK,
        gap: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        zIndex: 1,
    },
    title: {
        color: Color.WHITE,
        fontSize: 20,
        fontFamily: 'Roboto',
        fontWeight: '700',
        lineHeight: 24,
        paddingRight: spacing.xl,
    },
    description: {
        color: Color.FADED_WHITE,
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },
    primaryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: radius.sm,
        backgroundColor: Color.BUTTON_RED,
    },
    primaryButtonText: {
        color: Color.WHITE,
        fontSize: 15,
        fontWeight: '600',
    },
});
