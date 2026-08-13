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

    const buildCells = (code: string): string[] =>
        Array.from({ length }, (_, i) => code.replace(/\D/g, '')[i] ?? '');

    const commitCells = (cells: string[]) => {
        onChangeText(cells.filter((c) => c !== '').join('').slice(0, length));
    };

    const setDigitAt = (index: number, digit: string) => {
        const cells = buildCells(value);
        cells[index] = digit;
        commitCells(cells);
        if (digit && index < length - 1) {
            focusCell(index + 1);
        }
    };

    const handleChange = (index: number, text: string) => {
        if (disabled) {
            return;
        }
        const digits = text.replace(/\D/g, '');
        if (digits.length === 0) {
            const cells = buildCells(value);
            cells[index] = '';
            commitCells(cells);
            return;
        }
        if (digits.length === 1) {
            setDigitAt(index, digits);
            return;
        }
        // Android typing quirk: cell had "5", user types "6" → onChangeText("56")
        const previous = value[index] ?? '';
        const isAndroidAppendQuirk =
            digits.length === 2 && previous !== '' && digits.startsWith(previous);
        if (isAndroidAppendQuirk) {
            setDigitAt(index, digits.slice(-1));
            return;
        }
        // Clipboard paste / autofill — fill the whole OTP from the copied digits
        const pasted = digits.slice(0, length);
        onChangeText(pasted);
        focusCell(Math.min(pasted.length, length) - 1);
    };

    const handleKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (disabled) {
            return;
        }
        if (e.nativeEvent.key !== 'Backspace') {
            return;
        }
        const cells = buildCells(value);
        if (cells[index]) {
            cells[index] = '';
            commitCells(cells);
            return;
        }
        if (index > 0) {
            cells[index - 1] = '';
            commitCells(cells);
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
                        textContentType="oneTimeCode"
                        autoComplete="sms-otp"
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
