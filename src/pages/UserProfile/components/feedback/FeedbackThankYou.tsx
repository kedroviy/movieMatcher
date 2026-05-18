import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SimpleButton } from 'shared';
import { Color } from 'styles/colors';

type FeedbackThankYouProps = {
    message: string;
    backLabel: string;
    onBack: () => void;
    buttonWidth: number;
};

export const FeedbackThankYou: FC<FeedbackThankYouProps> = ({ message, backLabel, onBack, buttonWidth }) => (
    <View style={styles.container}>
        <Text style={styles.message}>{message}</Text>
        <SimpleButton
            title={backLabel}
            color={Color.BUTTON_RED}
            titleColor={Color.WHITE}
            onHandlePress={onBack}
            buttonWidth={buttonWidth}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 32,
        justifyContent: 'space-between',
        paddingBottom: 32,
    },
    message: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 25.2,
        color: Color.WHITE,
        textAlign: 'center',
    },
});
