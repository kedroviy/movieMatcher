import { FC, useState } from "react"
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import { Input } from "../ui";
import { RootState } from "../../../redux/configure-store";
import { AppConstants, Loader } from "../../../shared";

export const LoginAccRecovery: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const { loading } = useSelector((state: RootState) => state.authSlice);
    const [email, onChangeEmail] = useState<string>(AppConstants.EMPTY_VALUE);
    const [isFormValidEmail, setIsFormValidEmail] = useState<boolean>(false);

    const handleValidationEmail = (isValid: boolean) => {
        setIsFormValidEmail(isValid);
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
                <Text style={[styles.text, styles.headerText, { marginBottom: 12 }]}>Введите ваш email</Text>
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
                    Для восстановления пароля введите ваш адрес электронной почты.
                </Text>
                <Input
                    type='email'
                    label='Почта'
                    onChangeText={onChangeEmail}
                    value={email}
                    onValidationChange={handleValidationEmail}
                    placeholder='Введите ваш email'
                    textError='формат почты name@mail.com'
                />

                <TouchableOpacity
                    style={[styles.button,
                    (isFormValidEmail) ?
                        { backgroundColor: '#ED0E0E', width: windowWidth - 32, height: 48 } :
                        { backgroundColor: '#940C0C', width: windowWidth - 32, height: 48 }
                    ]}
                    disabled={isFormValidEmail ? false : true}
                    testID='myButton'
                >
                    <Text style={styles.text}>Продолжить</Text>
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