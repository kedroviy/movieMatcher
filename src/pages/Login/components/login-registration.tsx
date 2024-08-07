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
    ScrollView,
} from "react-native"
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { Input } from "../ui";
import { authRegistrationUser } from "../../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/configure-store";
import { CheckSvgIcon, Loader } from "../../../shared";
import { AppRoutes } from "app/constants";
import { Color } from "styles/colors";
import { useTranslation } from "react-i18next";

export const LoginRegistration: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const dispatch: AppDispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.authSlice);
    const { t } = useTranslation();
    const [email, onChangeEmail] = useState<string>('');
    const [password, onChangePassword] = useState<string>('');
    const navigation: NavigationProp<ParamListBase> = useNavigation();
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
                navigation.navigate(AppRoutes.LOGIN_RESULT, {
                    icon: <CheckSvgIcon />,
                    resultText: t('auth.registration.reg_result'),
                    buttonText: t('general.enter_in_account'),
                    buttonColor: Color.BUTTON_RED,
                    onHandlePress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [
                                { name: AppRoutes.LOGIN_SCREEN },
                            ],
                        })
                    },
                });
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
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 30, }}
            >
                <View style={{
                    alignItems: 'flex-start',
                    width: windowWidth,
                    paddingHorizontal: 16,
                    gap: 16,
                    top: 24,
                    flex: 1,
                }}>
                    <Text style={[styles.text, styles.headerText, { marginBottom: 24 }]}>Регистрация аккаунта</Text>
                    <Input
                        type='email'
                        label='Почта'
                        onChangeText={onChangeEmail}
                        value={email}
                        onValidationChange={handleValidationEmail}
                        placeholder='Введите ваш email'
                        textError='формат почты name@mail.com'
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
                            testID='myButton'
                        >
                            <Text style={styles.text}>Создать аккаунт</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#DF0A1E', width: windowWidth - 32, height: 48 }]
                            }
                            onPress={() => onSubmitForm({ email, password })}
                            testID='myButton'
                        >
                            <Text style={styles.text}>Создать аккаунт</Text>
                        </TouchableOpacity>
                    }
                </View>
            </ScrollView>
            {loading ? <Loader /> : null}
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container: {
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
