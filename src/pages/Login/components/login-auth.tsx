import { FC, useState } from "react"
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import BackIcon from '../../../../assets/backArrow.svg';
import { AppDispatch, RootState } from "../../../redux/configure-store";
import { authUser } from "../../../redux/authSlice";
import { AppConstants, Loader } from "@shared/index";
import { Input } from "../ui";

export const LoginAuth: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const dispatch: AppDispatch = useDispatch()
    const { loading } = useSelector((state: RootState) => state.authSlice);
    const [email, onChangeEmail] = useState<string>(AppConstants.EMPTY_VALUE);
    const [password, onChangePassword] = useState<string>(AppConstants.EMPTY_VALUE);
    const [isFormValidEmail, setIsFormValidEmail] = useState<boolean>(false);
    const [isFormValidPassword, setIsFormValidPassword] = useState<boolean>(false);

    const onLoginUser = async (user: { email: string; password: string }) => {
        Keyboard.dismiss();
        await dispatch(authUser(user));
    }

    const handleValidationEmail = (isValid: boolean) => {
        setIsFormValidEmail(isValid);
    };

    const handleValidationPassword = (isValid: boolean) => {
        setIsFormValidPassword(isValid)
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container,
            { width: windowWidth }]}
        >
            <View style={{ width: '100%', gap: 16, top: 10, flex: 0.1, }}>
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
                marginBottom: 30,
                gap: 16,
                bottom: '10%',
                flex: 0.6,
            }}>
                <Text style={[styles.text, styles.headerText, { marginBottom: 24 }]}>Войти в аккаунт</Text>

                <Input
                    type='email'
                    label='Почта'
                    onChangeText={onChangeEmail}
                    value={email}
                    onValidationChange={handleValidationEmail}
                    placeholder='Введите ваш email'
                    textError='Формат почты name@mail.com'
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

                <TouchableOpacity
                    style={[styles.button,
                    (isFormValidPassword && isFormValidEmail) ?
                        { backgroundColor: '#ED0E0E', width: windowWidth - 32, height: 48 } :
                        { backgroundColor: '#940C0C', width: windowWidth - 32, height: 48 }
                    ]}
                    disabled={(isFormValidPassword && isFormValidEmail) ? false : true}
                    onPress={() => onLoginUser({ email, password })}
                >
                    <Text style={styles.text}>Войти</Text>
                </TouchableOpacity>

            </View>
            <View style={{ width: windowWidth - 32, bottom: 20, }}>
                <TouchableOpacity
                    style={
                        {
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
                    onPress={() => navigation.navigate('LoginAccRecovery')}
                >
                    <Text style={styles.text}>Забыли пароль? Восстановить</Text>
                </TouchableOpacity>
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
        justifyContent: 'space-between',
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