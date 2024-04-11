import { FC, useEffect, useState } from "react"
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native"

import { Color } from "styles/colors";

type InputType = {
    label?: string;
    onChangeText: (text: string) => void;
    value: string;
    placeholder?: string;
    textError?: string | null;
    onValidationChange?: (isValid: boolean) => void;
}

export const SimpleInput: FC<InputType> = ({
    label,
    onChangeText,
    value,
    placeholder,
    textError,
    onValidationChange,
}) => {
    const windowWidth = Dimensions.get('window').width;
    const [isInputValid, setIsInputValid] = useState<boolean>(true);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() => {
        const isValid = !!value.trim();
        setIsInputValid(isValid);

        if (onValidationChange) {
            onValidationChange(isValid);
        }
    }, [value]);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, isFocused && styles.focused, !isInputValid && styles.error]}
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={'#AAAAAA'}
            />
            {!isInputValid && textError && (
                <Text style={styles.errorText}>
                    {textError}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        color: Color.WHITE,
        marginBottom: 8,
        fontFamily: 'Roboto',
    },
    input: {
        backgroundColor: Color.INPUT_GREY,
        borderRadius: 5,
        width: Dimensions.get('window').width - 32,
        height: 48,
        padding: 12,
        fontSize: 14,
        color: Color.WHITE,
    },
    errorText: {
        color: '#ED0E0E',
        fontSize: 12,
        marginTop: 4,
    },
    focused: {
        borderWidth: 1,
        borderColor: '#F9F9F9',
    },
    error: {
        borderWidth: 1,
        borderColor: '#ED0E0E',
    }
});
