import { FC, useRef, useState } from "react"
import {
    Dimensions,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { AppDispatch, RootState } from "../../../redux/configure-store";
import { AppConstants, MovieLoader } from "../../../shared";
import { sendRecoveryCodeEffect } from "redux/recoveryPasswordSlice";

const CODE_LENGTH = 4;

export const LoginAccRecoveryCode: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const dispatch: AppDispatch = useDispatch();
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const { loading, email } = useSelector((state: RootState) => state.recoveryPasswordSlice);
    const [code, setCode] = useState<string>(AppConstants.EMPTY_VALUE);
    const [containerIsFocused, setContainerIsFocused] = useState(false);
    const [isNotAllowRequest, setIsNotAllowRequest] = useState<boolean>(false);

    const codeDigitsArray = Array.from({ length: CODE_LENGTH }, (_, idx) => idx);

    const ref = useRef<TextInput>(null);

    const handleOnPress = () => {
        setContainerIsFocused(true);
        ref?.current?.focus();
    };

    const onSendCode = async (code: string, email: string) => {
        try {
            const actionResult = await dispatch(sendRecoveryCodeEffect({ code, email }));

            if (sendRecoveryCodeEffect.fulfilled.match(actionResult)) {
                console.log('code sent successfully');
                navigation.navigate('LoginAccRecoveryChangePassword');
            } else {
                console.log('Failed to send email');
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleOnBlur = () => {
        if (email && code) {
            onSendCode(code, email);
            setContainerIsFocused(false);
        }
    };

    const partialEmail = email?.replace(/(\w{1})[\w.-]+@([\w.]+\w)/, "$1***@$2");

    const toDigitInput = (_value: number, idx: number) => {
        const emptyInputChar = ' ';
        const digit = code[idx] || emptyInputChar;

        const isCurrentDigit = idx === code.length;
        const isLastDigit = idx === CODE_LENGTH - 1;
        const isCodeFull = code.length === CODE_LENGTH;

        const isFocused = isCurrentDigit || (isLastDigit && isCodeFull);

        const containerStyle =
            containerIsFocused && isFocused
                ? { ...styles.inputContainer, ...styles.inputContainerFocused }
                : styles.inputContainer;

        return (
            <View key={idx} style={containerStyle}>
                <Text style={styles.inputText}>{digit}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { width: windowWidth }]}>
            <View style={{
                alignItems: 'flex-start',
                width: windowWidth,
                paddingHorizontal: 16,
                gap: 16,
                top: 32,
            }}>
                <Text style={[styles.text, styles.headerText, { marginBottom: 12 }]}>Письмо отправлено</Text>
                <Text style={[styles.secondaryText]}>
                    На адрес {partialEmail} направлен код восстановления пароля, введите его, пожалуйста.
                    Возможно, письмо с кодом попало в спам.
                </Text>
                <View style={{ width: windowWidth, top: 24 }}>
                    <Pressable style={styles.inputsContainer} onPress={handleOnPress}>
                        {codeDigitsArray.map(toDigitInput)}
                    </Pressable>
                    <TextInput
                        ref={ref}
                        value={code}
                        onChangeText={setCode}
                        onSubmitEditing={handleOnBlur}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        textContentType="oneTimeCode"
                        maxLength={CODE_LENGTH}
                        style={styles.hiddenCodeInput}
                    />
                </View>
                <TouchableOpacity
                    style={{ width: '100%', alignItems: 'center', top: 48, }}
                    disabled={isNotAllowRequest}

                >
                    <Text style={styles.secondaryText}>Запросить код</Text>
                </TouchableOpacity>
            </View>
            {loading ? <MovieLoader /> : null}
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    inputsContainer: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 70,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#595959',
    },
    inputContainerFocused: {
        borderColor: '#0f5181',
    },
    inputText: {
        color: '#F9F9F9',
        fontFamily: 'Roboto',
        fontSize: 18,
    },
    hiddenCodeInput: {
        position: 'absolute',
        height: 0,
        width: 0,
        opacity: 0,
    },
    text: {
        color: '#F9F9F9',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 21.6,
    },
    secondaryText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20.8,
        color: '#F9F9F9',
    },
    headerText: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28.8,
    },
});