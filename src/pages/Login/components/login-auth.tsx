import { FC, useEffect, useState } from "react"
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import BackIcon from '../../../../assets/backArrow.svg';
import VisibilityEye from '../../../../assets/visibility.svg';
import NotVisibilityEye from '../../../../assets/visibility-no.svg';
import { AppDispatch } from "../../../redux/configure-store";
import { authUser } from "../../../redux/authSlice";
import { Loader } from "../../../shared";

export const LoginAuth: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const dispatch: AppDispatch = useDispatch()
    const { loading } = useSelector((state: any) => state.authSlice);
    const [email, onChangeEmail] = useState<string>('');
    const [password, onChangePassword] = useState<string>('');
    const [emailErrors, setEmailErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [isFormValidEmail, setIsFormValidEmail] = useState<boolean>(false);
    const [isFormValidPassword, setIsFormValidPassword] = useState<boolean>(false);
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() => {
        validateEmail();
        validatePassword();
    }, [email, password, loading]);

    const onLoginUser = async (user: { email: string; password: string }) => {
        const actionResult = await dispatch(authUser(user));

        if (authUser.fulfilled.match(actionResult)) {
        } else if (authUser.rejected.match(actionResult)) {
            console.log(actionResult)
        }

    }

    const validateEmail = () => {
        let emailErrors = {};

        if (email.length && !/\S+@\S+\.\S+/.test(email)) {
            emailErrors.email = 'Email введен не верно';
        }

        setEmailErrors(emailErrors);
        setIsFormValidEmail(Object.keys(emailErrors).length === 0);
    };

    const validatePassword = () => {
        let passwordErrors = {};

        // Validate email field 
        if (password.length < 6 && password.length) {
            passwordErrors.password = 'Пароль слишком короткий (минимум 8 символов)';
        }

        setPasswordErrors(passwordErrors);
        setIsFormValidPassword(Object.keys(passwordErrors).length === 0);
    };

    return (
        <View style={[styles.container, { width: windowWidth }]}>
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
                <Text style={[styles.text, styles.headerText, { marginBottom: 24 }]}>Войти в аккаунт</Text>
                <Text style={{
                    fontSize: 14,
                    color: '#F9F9F9',
                    gap: 16,
                    lineHeight: 16.8,
                    fontWeight: '400',
                    fontFamily: 'Roboto'
                }}>
                    Почта
                </Text>
                <TextInput
                    style={[
                        !isFormValidEmail ? styles.error : null,
                        isFocused ? styles.focused : null, {
                            backgroundColor: '#595959',
                            borderRadius: 5,
                            width: windowWidth - 32,
                            height: 48,
                            gap: 16,
                            padding: 12,
                            fontSize: 14,
                            color: '#FFFFFF',
                        }]}
                    onBlur={() => setIsFocused(false)}
                    onFocus={() => setIsFocused(true)}
                    onChangeText={onChangeEmail}
                    value={email}
                    placeholder={!isFocused ? "Введите ваш e-mail" : ''}
                    placeholderTextColor={'#FFF'}
                />
                {Object.values(emailErrors).map((error, index) => (
                    <Text key={index} style={styles.errorText}>
                        {error}
                    </Text>
                ))}
                <View style={{
                    gap: 16
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#F9F9F9',
                        gap: 16,
                        lineHeight: 16.8,
                        fontWeight: '400',
                        fontFamily: 'Roboto'
                    }}>
                        Пароль
                    </Text>
                    <TextInput
                        style={[isFocused ? styles.focused : null, {
                            backgroundColor: '#595959',
                            borderRadius: 5,
                            width: windowWidth - 32,
                            height: 48,
                            gap: 16,
                            padding: 10,
                            fontSize: 14,
                            color: '#FFFFFF',
                        }]}
                        onBlur={() => setIsFocused(false)}
                        onFocus={() => setIsFocused(true)}
                        onChangeText={onChangePassword}
                        value={password}
                        placeholder="Введите ваш пароль"
                        placeholderTextColor={'#FFF'}
                        secureTextEntry={hidePass ? true : false}
                    />
                    {hidePass ?
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            right: 3,
                            top: '42%',
                            height: 44,
                            width: 42,
                            backgroundColor: '#595959',
                            borderBottomRightRadius: 5,
                            borderTopRightRadius: 5,
                        }}>
                            <VisibilityEye
                                onPress={() => setHidePass(!hidePass)}
                            />
                        </TouchableOpacity> :
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            right: 3,
                            top: '42%',
                            height: 44,
                            width: 42,
                            backgroundColor: '#595959',
                            borderBottomRightRadius: 5,
                            borderTopRightRadius: 5,
                        }}>
                            <NotVisibilityEye
                                onPress={() => setHidePass(true)}
                            />
                        </TouchableOpacity>
                    }

                </View>
                {Object.values(passwordErrors).map((error, index) => (
                    <Text key={index} style={styles.errorText}>
                        {error}
                    </Text>
                ))}
                {!isFormValidPassword || !isFormValidEmail ?
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#940C0C', width: windowWidth - 32, height: 48 }]
                        }
                        onPress={() => console.log('1')}
                    >
                        <Text style={styles.text}>Войти</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#DF0A1E', width: windowWidth - 32, height: 48 }]
                        }
                        onPress={() => onLoginUser({ email, password })}
                    >
                        <Text style={styles.text}>Войти</Text>
                    </TouchableOpacity>
                }
            </View>
            <TouchableOpacity
                style={
                    {
                        top: '40%',
                        width: windowWidth - 32,
                        height: 44,
                        gap: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#FFF',
                        borderRadius: 5,
                    }
                }
                onPress={() => { console.log('restore password') }}
            >
                <Text style={styles.text}>Забыли пароль? Восстановить</Text>
            </TouchableOpacity>
            {loading ? <Loader /> : null}
        </View>
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