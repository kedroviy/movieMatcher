import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import {
    GoogleSignin,
    User,
} from '@react-native-google-signin/google-signin';
import { useNavigation } from "@react-navigation/native";
import { View } from 'react-native-ui-lib';

import { saveGoogleAuthCode } from "../../redux/authSlice";
import StartLogotype from '../../../assets/startLogo.svg';
import GoogleIcon from '../../../assets/google.svg'

export const LoginScreen = () => {
    const dispatch = useDispatch();
    const navigation: any = useNavigation();
    const windowWidth = Dimensions.get('window').width;
    const [user, setUser] = useState<User | undefined>();


    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '277043180680-ugnrupqacuchkhpklb1qhv8kaueh4eks.apps.googleusercontent.com',
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });
        isSignedIn();
    }, [user]);

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo: User = await GoogleSignin.signIn();
            console.log('__due__ :', userInfo);
            dispatch(saveGoogleAuthCode(userInfo?.idToken as string));
            setUser(userInfo);

        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    };

    const isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (!!isSignedIn) {

            getCurrentUserInfo()
        } else {
            console.log('please login')
        }
    };

    const getCurrentUserInfo = async () => {
        try {
            const userInfo: User = await GoogleSignin.signInSilently();
            console.log('currentUserInfo: ', userInfo)

            setUser(userInfo);
        } catch (error) {
            if (error) {
                console.log('Get current user info Error message: ', error)
            }
        }
    };

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            setUser({ user: null } as unknown as User);
        } catch (error) {
            console.error(error);
        }
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
                }}>Сделай подбор фильм самостоятельно или в компании друзей</Text>
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
                    onPress={signIn}
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
                    onPress={() => navigation.navigate('LoginAuth')}
                >
                    <Text style={{
                        color: '#FFF',
                        fontSize: 18,
                        fontWeight: '500',
                    }}>Зарегистрироваться</Text>
                </TouchableOpacity>
            </View>
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
    text: {
        color: '#F9F9F9',
        fontWeight: '500'
    },
    headerText: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28.8
    },
});
