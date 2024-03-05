import { FC, useState } from "react"
import {
    Dimensions,
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import BackIcon from '../../../../assets/backArrow.svg';
import { AppDispatch } from "../../../redux/configure-store";
import { authUser } from "../../../redux/authSlice";
import { Loader } from "../../../shared";
import { Input } from "../ui";

export const LoginAuth: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const dispatch: AppDispatch = useDispatch()
    const { loading } = useSelector((state: any) => state.authSlice);
    const [email, onChangeEmail] = useState<string>('');
    const [password, onChangePassword] = useState<string>('');
    const [isFormValidEmail, setIsFormValidEmail] = useState<boolean>(false);
    const [isFormValidPassword, setIsFormValidPassword] = useState<boolean>(false);

    const onLoginUser = async (user: { email: string; password: string }) => {
        Keyboard.dismiss();
        const actionResult = await dispatch(authUser(user));

        if (authUser.fulfilled.match(actionResult)) {
        } else if (authUser.rejected.match(actionResult)) {
            console.log(actionResult)
        }
    }

    const handleValidationEmail = (isValid: boolean) => {
        setIsFormValidEmail(isValid);
    };

    const handleValidationPassword = (isValid: boolean) => {
        setIsFormValidPassword(isValid)
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

                {!isFormValidPassword || !isFormValidEmail ?
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#940C0C', width: windowWidth - 32, height: 48 }]
                        }
                        disabled={true}
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
});