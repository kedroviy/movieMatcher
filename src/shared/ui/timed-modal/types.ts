import type { ReactNode } from 'react';
import type { Insets, StyleProp, ViewStyle } from 'react-native';

export type VoidCallback = () => void;

export type ModalBackdropProps = {
    children: ReactNode;
    onBackdropPress?: VoidCallback;
    contentStyle?: StyleProp<ViewStyle>;
};

export type ModalTimerBarProps = {
    active: boolean;
    durationMs: number;
    onComplete: VoidCallback;
};

export type TimedModalCardProps = {
    title: string;
    description: string;
    closeLabel: string;
    timerActive: boolean;
    autoDismissMs: number;
    onClose: VoidCallback;
    onTimerComplete: VoidCallback;
    children?: ReactNode;
    closeHitSlop?: Insets;
};

export type TimedModalProps = {
    visible: boolean;
    onClose: VoidCallback;
    title: string;
    description: string;
    closeLabel: string;
    autoDismissMs?: number;
    dismissOnBackdropPress?: boolean;
    children?: ReactNode;
};
