import type { FC } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { TIMED_MODAL_DEFAULT_DISMISS_MS } from './constants';
import { ModalBackdrop } from './modal-backdrop';
import { TimedModalCard } from './timed-modal-card';
import type { TimedModalProps } from './types';

export const TimedModal: FC<TimedModalProps> = ({
    visible,
    onClose,
    title,
    description,
    closeLabel,
    autoDismissMs = TIMED_MODAL_DEFAULT_DISMISS_MS,
    dismissOnBackdropPress = true,
    children,
}) => {
    if (!visible) {
        return null;
    }

    const handleBackdropPress = dismissOnBackdropPress ? onClose : undefined;

    return (
        <Modal transparent visible animationType="none" onRequestClose={onClose} statusBarTranslucent>
            <View style={styles.host}>
                <ModalBackdrop onBackdropPress={handleBackdropPress}>
                    <TimedModalCard
                        title={title}
                        description={description}
                        closeLabel={closeLabel}
                        timerActive={visible}
                        autoDismissMs={autoDismissMs}
                        onClose={onClose}
                        onTimerComplete={onClose}
                    >
                        {children}
                    </TimedModalCard>
                </ModalBackdrop>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    host: {
        flex: 1,
    },
});
