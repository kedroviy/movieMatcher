import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { View } from 'react-native-ui-lib';

import StartLogotype from '../../../assets/startLogo.svg';
import GoogleIcon from '../../../assets/google.svg'

import { AppDispatch } from "../../redux/configure-store";
import { authenticateWithGoogle } from "../../redux/authSlice";
import { Loader } from "../../shared";

export const LoginScreen = () => {
    const dispatch: AppDispatch = useDispatch();
    const { loading } = useSelector((state: any) => state.authSlice);
    const navigation: any = useNavigation();
    const windowWidth = Dimensions.get('window').width;

    const onAuthWithGoogle = async () => {
        await dispatch(authenticateWithGoogle());
    };

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{ width: 328, height: 328, marginVertical: 25, }}>
                <StartLogotype />
            </View>
            <View style={{ width: 328, gap: 12, alignItems: 'center', marginTop: 20 }}>
                <Text style={{
                    color: '#FFFFFF',
                    fontSize: 22,
                    fontWeight: '700',
                    lineHeight: 27.5,
                    textAlign: 'center'
                }}>Добро пожаловать в MovieMatch!</Text>
                <Text style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '400',
                    lineHeight: 21.6,
                    textAlign: 'center'
                }}>Сделай подбор фильмов самостоятельно или в компании друзей</Text>
            </View>
            <View style={{ width: '100%', alignItems: 'center', gap: 16, marginTop: 52, }}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            flexDirection: 'row',
                            width: windowWidth - 32,
                            height: 48,
                            backgroundColor: '#DF0A1E',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }
                    ]}
                    onPress={() => navigation.navigate('LoginAuth')}
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
                >
                    <GoogleIcon width={36} height={36} />
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
