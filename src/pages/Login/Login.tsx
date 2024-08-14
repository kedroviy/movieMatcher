import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from "react-native";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { AppDispatch } from "../../redux/configure-store";
import { authenticateWithGoogle } from "../../redux/authSlice";
import { GoogleSvgIcon, Loader } from "@shared/index";
import { Color } from "styles/colors";
import { useTranslation } from "react-i18next";

const windowWidth = Dimensions.get('window').width;

export const LoginScreen = () => {
    const dispatch: AppDispatch = useDispatch();
    const { t } = useTranslation();
    const { loading } = useSelector((state: any) => state.authSlice);
    const navigation: NavigationProp<ParamListBase> = useNavigation();

    const onAuthWithGoogle = async () => {
        await dispatch(authenticateWithGoogle());
    };

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{
                alignItems: 'center',
                width: '100%',
                height: 328,
                marginVertical: 24,
            }}>
                <Image
                    source={require('../../../assets/11223.png')}
                    style={{
                        width: windowWidth - 32, height: '100%'
                    }}
                />
            </View>
            <View style={{ width: 328, gap: 12, alignItems: 'center', marginTop: 32 }}>
                <Text style={{
                    color: Color.WHITE,
                    fontSize: 22,
                    fontWeight: '700',
                    lineHeight: 27.5,
                    textAlign: 'center'
                }}>{t('auth.welcome')}</Text>
                <Text style={{
                    color: Color.WHITE,
                    fontSize: 16,
                    fontWeight: '400',
                    lineHeight: 21.6,
                    textAlign: 'center'
                }}>{t('auth.sub_welcome')}</Text>
            </View>
            <View style={{ width: '100%', alignItems: 'center', gap: 16, marginTop: 32, }}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            flexDirection: 'row',
                            width: windowWidth - 32,
                            height: 48,
                            backgroundColor: Color.BUTTON_RED,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }
                    ]}
                    onPress={() => navigation.navigate('LoginAuth')}
                    testID='myButton'
                >
                    <Text style={{
                        color: Color.WHITE,
                        fontSize: 18,
                        fontWeight: '500',
                    }}>{t('auth.login.btn_title')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            flexDirection: 'row',
                            width: windowWidth - 32,
                            height: 48,
                            backgroundColor: Color.WHITE,
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }
                    ]}
                    onPress={onAuthWithGoogle}
                    testID='myButton'
                >
                    <GoogleSvgIcon />
                    <Text style={{
                        color: Color.NEW_BLACK,
                        fontSize: 18,
                        fontWeight: '500',
                        left: (windowWidth / 6),
                    }}>{t('auth.login.btn_google')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            flexDirection: 'row',
                            width: windowWidth - 32,
                            height: 48,
                            backgroundColor: Color.GREEN,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }
                    ]}
                    onPress={() => navigation.navigate('LoginRegistration')}
                    testID='myButton'
                >
                    <Text style={{
                        color: Color.WHITE,
                        fontSize: 18,
                        fontWeight: '500',
                    }}>{t('auth.registration.btn_title')}</Text>
                </TouchableOpacity>
            </View>
            {loading ? <Loader /> : null}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.BACKGROUND_GREY,
        flex: 1,
        width: windowWidth - 32,
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: Color.INPUT_GREY,
        padding: 10,
        width: 328,
        height: 44,
        gap: 10,
        borderRadius: 5,
    },
});
