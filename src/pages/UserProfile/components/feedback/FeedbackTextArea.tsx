import { FC, useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

import { Color } from 'styles/colors';

type FeedbackTextAreaProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    textError?: string | null;
    editable?: boolean;
};

export const FeedbackTextArea: FC<FeedbackTextAreaProps> = ({
    value,
    onChangeText,
    placeholder,
    textError,
    editable = true,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const showError = !value.trim() && textError;

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.focused,
                    showError && styles.error,
                    !editable && styles.disabled,
                ]}
                multiline
                textAlignVertical="top"
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#AAAAAA"
                editable={editable}
            />
            {showError && <Text style={styles.errorText}>{textError}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
    },
    input: {
        backgroundColor: Color.INPUT_GREY,
        borderRadius: 5,
        width: Dimensions.get('window').width - 32,
        minHeight: 160,
        padding: 12,
        fontSize: 14,
        color: Color.WHITE,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 12,
        marginTop: 4,
    },
    focused: {
        borderWidth: 1,
        borderColor: '#FAFAFA',
    },
    error: {
        borderWidth: 1,
        borderColor: '#DC2626',
    },
    disabled: {
        opacity: 0.6,
    },
});
