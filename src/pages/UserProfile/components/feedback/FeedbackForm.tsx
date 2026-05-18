import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SimpleButton } from 'shared';
import { Color } from 'styles/colors';

import { FeedbackTextArea } from './FeedbackTextArea';

type FeedbackFormProps = {
    description: string;
    submitLabel: string;
    textError: string;
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    inputDisabled: boolean;
    submitDisabled: boolean;
    buttonWidth: number;
    showTextError: boolean;
};

export const FeedbackForm: FC<FeedbackFormProps> = ({
    description,
    submitLabel,
    textError,
    value,
    onChangeText,
    onSubmit,
    inputDisabled,
    submitDisabled,
    buttonWidth,
    showTextError,
}) => (
    <View style={styles.form}>
        <Text style={styles.description}>{description}</Text>
        <FeedbackTextArea
            value={value}
            onChangeText={onChangeText}
            textError={showTextError ? textError : null}
            editable={!inputDisabled}
        />
        <SimpleButton
            title={submitLabel}
            color={submitDisabled ? '#940C0C' : Color.BUTTON_RED}
            titleColor={Color.WHITE}
            onHandlePress={onSubmit}
            buttonWidth={buttonWidth}
            disabled={submitDisabled}
        />
    </View>
);

const styles = StyleSheet.create({
    form: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 24,
        gap: 24,
    },
    description: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 20.8,
        color: Color.WHITE,
    },
});
