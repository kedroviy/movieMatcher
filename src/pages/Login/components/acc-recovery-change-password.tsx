import { FC, useEffect, useState } from "react"
import { Dimensions, Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { sendRecoveryNewPasswordEffect } from "redux/recoveryPasswordSlice";
import { AppDispatch, RootState } from "../../../redux/configure-store";
import { Loader } from "../../../shared";
import Icon from '../../../../assets/check.svg';
import { Input } from "../ui";
import { AppRoutes } from "app/constants";

export const LoginAccRecoveryChangePassword: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const dispatch: AppDispatch = useDispatch();
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const { loading, email, code } = useSelector((state: RootState) => state.recoveryPasswordSlice);
    const [password, onChangePassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isFormValidPassword, setIsFormValidPassword] = useState<boolean>(false);
    const [isFormValidConfirmPassword, setIsFormValidConfirmPassword] = useState<boolean>(false);

    const handleValidationPassword = (isValid: boolean) => {
        setIsFormValidPassword(isValid)
    };

    useEffect(() => {
        setIsFormValidConfirmPassword(confirmPassword.length > 0 && confirmPassword == password);
    }, [password, confirmPassword]);

    const onSubmitComponent = async (email: string | null, code: string | null, password: string) => {
        Keyboard.dismiss();
        if (email && code) {
            try {
                const actionResult = await dispatch(sendRecoveryNewPasswordEffect({ email, code, password }));

                if (sendRecoveryNewPasswordEffect.fulfilled.match(actionResult)) {
                    navigation.navigate(AppRoutes.LOGIN_RESULT, {
                        icon: <Icon width={41} height={41} />,
                        resultText: 'Поздравляем, пароль успешно изменен!',
                        buttonText: 'Войти в аккаунт',
                        buttonColor: '#ED0E0E',
                        onHandlePress: () => { 
                            navigation.reset({
                            index: 0,
                            routes: [
                                { name: AppRoutes.LOGIN_SCREEN },
                            ],
                        })},
                    });

                } else {
                    console.log('Failed to password change');
                }
            } catch (error) {
                console.log(error)
            }
        }
    };

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{
                alignItems: 'flex-start',
                width: windowWidth,
                paddingHorizontal: 16,
                gap: 16,
                flex: 1,
                top: 24,
            }}>
                <Text style={[styles.text, styles.headerText, { marginBottom: 12 }]}>Новый пароль</Text>
                <Text style={{
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 20.8,
                    color: '#F9F9F9',
                    marginBottom: 12
                }}
                >
                    Создайте новый пароль для своего аккаунта
                </Text>
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

                <TouchableOpacity
                    style={[styles.button,
                    (isFormValidPassword && isFormValidConfirmPassword) ?
                        { backgroundColor: '#ED0E0E', width: windowWidth - 32, height: 48 } :
                        { backgroundColor: '#940C0C', width: windowWidth - 32, height: 48 }
                    ]}
                    disabled={isFormValidPassword && isFormValidConfirmPassword ? false : true}
                    testID='myButton'
                    onPress={() => onSubmitComponent(email, code, password)}
                >
                    <Text style={styles.text}>Восстановить пароль</Text>
                </TouchableOpacity>

            </View>
            {loading ? <Loader /> : null}
        </View >
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
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