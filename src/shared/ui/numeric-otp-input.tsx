import { FC, useRef } from 'react';
import { NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputKeyPressEventData, View } from 'react-native';

import { Color } from 'styles/colors';

const DEFAULT_LENGTH = 6;

type NumericOtpInputProps = {
    length?: number;
    value: string;
    onChangeText: (text: string) => void;
    label?: string;
    errorText?: string | undefined;
    disabled?: boolean;
};

export const NumericOtpInput: FC<NumericOtpInputProps> = ({
    length = DEFAULT_LENGTH,
    value,
    onChangeText,
    label,
    errorText,
    disabled,
}) => {
    const refs = useRef<Array<TextInput | null>>([]);

    const focusCell = (index: number) => {
        const i = Math.max(0, Math.min(length - 1, index));
        refs.current[i]?.focus();
    };

    const handleChange = (index: number, text: string) => {
        if (disabled) {
            return;
        }
        const digits = text.replace(/\D/g, '');
        if (digits.length > 1) {
            onChangeText(digits.slice(0, length));
            focusCell(Math.min(digits.length, length) - 1);
            return;
        }
        if (digits.length === 1) {
            const next = (value.slice(0, index) + digits + value.slice(index + 1)).slice(0, length);
            onChangeText(next);
            if (index < length - 1) {
                focusCell(index + 1);
            }
            return;
        }
        const next = value.slice(0, index) + value.slice(index + 1);
        onChangeText(next);
    };

    const handleKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (disabled) {
            return;
        }
        if (e.nativeEvent.key !== 'Backspace') {
            return;
        }
        const ch = value[index];
        if (!ch && index > 0) {
            const next = value.slice(0, index - 1) + value.slice(index);
            onChangeText(next);
            focusCell(index - 1);
        }
    };

    return (
        <View style={styles.wrap}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View style={styles.row}>
                {Array.from({ length }, (_, i) => (
                    <TextInput
                        key={i}
                        ref={(r) => {
                            refs.current[i] = r;
                        }}
                        autoFocus={i === 0 && !disabled}
                        style={[
                            styles.cell,
                            errorText ? styles.cellError : null,
                            disabled ? styles.cellDisabled : null,
                        ]}
                        value={value[i] ?? ''}
                        onChangeText={(t) => handleChange(i, t)}
                        onKeyPress={(e) => handleKeyPress(i, e)}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        maxLength={length}
                        editable={!disabled}
                        selectTextOnFocus
                        caretHidden
                        importantForAutofill="no"
                    />
                ))}
            </View>
            {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        width: '100%',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: Color.WHITE,
        marginBottom: 12,
        fontFamily: 'Roboto',
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
    },
    cell: {
        flex: 1,
        minWidth: 0,
        height: 52,
        borderRadius: 10,
        backgroundColor: Color.INPUT_GREY,
        borderWidth: 1,
        borderColor: 'transparent',
        fontSize: 22,
        fontWeight: '600',
        color: Color.WHITE,
        textAlign: 'center',
        paddingVertical: 0,
    },
    cellError: {
        borderColor: Color.BUTTON_RED,
    },
    cellDisabled: {
        opacity: 0.5,
    },
    errorText: {
        color: Color.BUTTON_RED,
        fontSize: 12,
        marginTop: 8,
    },
});
