import { FC, useEffect, useState } from "react"
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

import VisibilityEye from '../../../../assets/visibility.svg';
import NotVisibilityEye from '../../../../assets/visibility-no.svg';
import { AppConstants } from "shared";

type InputProps = {
    label?: string;
    onChangeText: (text: string) => void;
    value: string;
    placeholder?: string;
    textError?: string | null;
    type?: 'password' | 'email' | 'confirm';
    onValidationChange?: (isValid: boolean) => void;
    isConfirm?: boolean;
}

export const Input: FC<InputProps> = ({
    label,
    onChangeText,
    value,
    placeholder,
    textError,
    type,
    onValidationChange,
    isConfirm
}) => {
    const windowWidth = Dimensions.get('window').width;
    const [inputErrors, setInputErrors] = useState({});
    const [isInputValid, setIsInputValid] = useState<boolean>(false);
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() => {
        validateInput();
    }, [value, isConfirm]);

    const validateInput = () => {
        let inputErrors = {};
        let isValid = true;

        switch (type) {
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) {
                    inputErrors = { value: `${textError}` };
                    isValid = false;
                }
                break;
            case 'password':
                if (value.length < 6) {
                    inputErrors = { value: `${textError}` };
                    isValid = false;
                }
                break;
            default:
                setIsInputValid(false);
                break;
        }

        setInputErrors(inputErrors);
        setIsInputValid(isValid);

        if (onValidationChange) {
            onValidationChange(isValid);
        }
    };

    return (
        <View style={{
            gap: 16,
        }}>
            <Text style={{
                fontSize: 14,
                color: '#F9F9F9',
                gap: 16,
                lineHeight: 16.8,
                fontWeight: '400',
                fontFamily: 'Roboto'
            }}>
                {label}
            </Text>
            <TextInput
                style={{
                    ...(isFocused && styles.focused),
                    ...((type === 'confirm' && !isConfirm && value.length) ? styles.error : null),
                    backgroundColor: '#595959',
                    borderRadius: 5,
                    width: windowWidth - 32,
                    height: 48,
                    gap: 16,
                    padding: 12,
                    fontSize: 14,
                    color: '#FFFFFF',
                }}
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={'#FFF'}
                secureTextEntry={type === 'password' || type === 'confirm' ? hidePass : false}
            />
            {type === 'password' && (
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        right: 3,
                        top: 40,
                        height: 32,
                        width: 32,
                        backgroundColor: '#595959',
                        borderBottomRightRadius: 5,
                        borderTopRightRadius: 5,
                    }}
                    onPress={() => setHidePass(!hidePass)}
                >
                    {hidePass ? <VisibilityEye /> : <NotVisibilityEye />}
                </TouchableOpacity>
            )}
            {type === 'confirm' && (
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        right: 3,
                        top: 40,
                        height: 32,
                        width: 32,
                        backgroundColor: '#595959',
                        borderBottomRightRadius: 5,
                        borderTopRightRadius: 5,
                    }}
                    onPress={() => setHidePass(!hidePass)}
                >
                    {hidePass ? <VisibilityEye /> : <NotVisibilityEye />}
                </TouchableOpacity>
            )}
            {
                value.length > 1 && Object.values(inputErrors).map((error, index) => (
                    <Text key={index} style={styles.errorText}>
                        {error as string}
                    </Text>
                ))
            }
            {(type === 'confirm' && !isConfirm && value.length) ?
                <Text key={textError} style={styles.errorText}>
                    {textError as string}
                </Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 21.6,
    },
    error: {
        borderWidth: 1,
        borderColor: '#ED0E0E',
    },
    errorText: {
        color: '#ED0E0E',
        fontSize: 14,
        lineHeight: 16.8
    },
    focused: {
        borderWidth: 1,
        borderColor: '#F9F9F9'
    }
});