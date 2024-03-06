import { FC, useEffect, useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native";

import BackIcon from '../../../../assets/backArrow.svg';
import { Input } from "../ui";
import { authRegistrationUser } from "../../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/configure-store";
import { Loader } from "../../../shared";

export const LoginRegistration: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const dispatch: AppDispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.authSlice);
    const [email, onChangeEmail] = useState<string>('');
    const [password, onChangePassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isFormValidEmail, setIsFormValidEmail] = useState<boolean>(false);
    const [isFormValidPassword, setIsFormValidPassword] = useState<boolean>(false);
    const [isFormValidConfirmPassword, setIsFormValidConfirmPassword] = useState<boolean>(false);

    useEffect(() => {
        setIsFormValidConfirmPassword(confirmPassword.length > 0 && confirmPassword == password);
    }, [password, confirmPassword]);

    const onSubmitForm = async (user: { email: string, password: string }) => {
        Keyboard.dismiss();
        const actionResult = await dispatch(authRegistrationUser(user));

        try {
            if (authRegistrationUser.fulfilled.match(actionResult)) {
                console.log(actionResult)
            } else if (authRegistrationUser.rejected.match(actionResult)) {
                Alert.alert('Неудачно!', 'Что-то пошло не так', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
                console.log(actionResult)
            }

        } catch (error) {
            console.log(error)
        }
    };

    const handleValidationEmail = (isValid: boolean) => {
        setIsFormValidEmail(isValid);
    };

    const handleValidationPassword = (isValid: boolean) => {
        setIsFormValidPassword(isValid)
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { width: windowWidth }]}
            behavior='padding'
            keyboardVerticalOffset={50}
        >
            <View style={{ width: '100%', gap: 16 }}>
                <TouchableOpacity
                    style={{
                        left: 16,
                        width: 24,
                        height: 44,
                        gap: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={() => { navigation.goBack() }}
                >
                    <BackIcon />
                </TouchableOpacity>
            </View>
            <View style={{
                alignItems: 'flex-start',
                width: windowWidth,
                paddingHorizontal: 16,
                gap: 16,
                top: 30,
            }}>
                <Text style={[styles.text, styles.headerText, { marginBottom: 24 }]}>Регистрация аккаунта</Text>
                <Input
                    type='email'
                    label='Почта'
                    onChangeText={onChangeEmail}
                    value={email}
                    onValidationChange={handleValidationEmail}
                    placeholder='Введите ваш email'
                    textError='Email не соответствует формату name@mail.com'
                />
                <Input
                    type='password'
                    label='Пароль'
                    onChangeText={onChangePassword}
                    onValidationChange={handleValidationPassword}
                    value={password}
                    placeholder='Введите ваш пароль'
                    textError='Пароль должен быть от 6 символов'
                />
                <Input
                    type='confirm'
                    label='Повторите пароль'
                    onChangeText={setConfirmPassword}
                    isConfirm={isFormValidConfirmPassword}
                    value={confirmPassword}
                    placeholder='Повторите ваш пароль'
                    textError='Пароли не совпадают'
                />
                {!isFormValidPassword || !isFormValidConfirmPassword || (!isFormValidEmail && !email.length) ?
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#940C0C', width: windowWidth - 32, height: 48 }]
                        }
                        disabled={true}
                    >
                        <Text style={styles.text}>Создать аккаунт</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#DF0A1E', width: windowWidth - 32, height: 48 }]
                        }
                        onPress={() => onSubmitForm({ email, password })}
                    >
                        <Text style={styles.text}>Создать аккаунт</Text>
                    </TouchableOpacity>
                }
            </View>
            {loading ? <Loader /> : null}
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        gap: 10,
        borderRadius: 5,
        marginTop: 16,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 21.6,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28.8,
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
