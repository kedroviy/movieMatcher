import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from "react-native";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { AppDispatch } from "../../redux/configure-store";
import { authenticateWithGoogle } from "../../redux/authSlice";
import { GoogleSvgIcon, Loader } from "@shared/index";
import { STRINGS } from "./constants";

export const LoginScreen = () => {
    const dispatch: AppDispatch = useDispatch();
    const { loading } = useSelector((state: any) => state.authSlice);
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const windowWidth = Dimensions.get('window').width;

    const onAuthWithGoogle = async () => {
        await dispatch(authenticateWithGoogle());
    };

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{ alignItems: 'center', width: windowWidth, height: 328, marginVertical: 24, }}>
                <Image source={require('../../../assets/startLogotype.png')} />
            </View>
            <View style={{ width: 328, gap: 12, alignItems: 'center', marginTop: 32 }}>
                <Text style={{
                    color: '#FFFFFF',
                    fontSize: 22,
                    fontWeight: '700',
                    lineHeight: 27.5,
                    textAlign: 'center'
                }}>{STRINGS.WELCOME}</Text>
                <Text style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '400',
                    lineHeight: 21.6,
                    textAlign: 'center'
                }}>{STRINGS.SUB_WELCOME}</Text>
            </View>
            <View style={{ width: '100%', alignItems: 'center', gap: 16, marginTop: 32, }}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            flexDirection: 'row',
                            width: windowWidth - 32,
                            height: 48,
                            backgroundColor: '#ED0E0E',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }
                    ]}
                    onPress={() => navigation.navigate('LoginAuth')}
                    testID='myButton'
                >
                    <Text style={{
                        color: '#FFF',
                        fontSize: 18,
                        fontWeight: '500',
                    }}>Войти</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            flexDirection: 'row',
                            width: windowWidth - 32,
                            height: 48,
                            backgroundColor: '#FFF',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }
                    ]}
                    onPress={onAuthWithGoogle}
                    testID='myButton'
                >
                    <GoogleSvgIcon />
                    <Text style={{
                        color: '#1D1D1D',
                        fontSize: 18,
                        fontWeight: '500',
                        left: (windowWidth / 6),
                    }}>Войти с Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            flexDirection: 'row',
                            width: windowWidth - 32,
                            height: 48,
                            backgroundColor: '#4AB34C',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }
                    ]}
                    onPress={() => navigation.navigate('LoginRegistration')}
                    testID='myButton'
                >
                    <Text style={{
                        color: '#FFF',
                        fontSize: 18,
                        fontWeight: '500',
                    }}>Зарегистрироваться</Text>
                </TouchableOpacity>
            </View>
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
        backgroundColor: '#595959',
        padding: 10,
        width: 328,
        height: 44,
        gap: 10,
        borderRadius: 5,
    },
});
