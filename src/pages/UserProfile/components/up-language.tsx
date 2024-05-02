import AsyncStorage from "@react-native-async-storage/async-storage";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from "react-native";
import { RadioButton } from "shared";
import { Color } from "styles/colors";


export const UPLanguage: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const [language, setLanguage] = useState<string | null>(null);
    const { i18n } = useTranslation();

    useEffect(() => {
        const loadLanguage = async () => {
            const savedLanguage = await AsyncStorage.getItem('language');
            if (savedLanguage) {
                setLanguage(savedLanguage);
                i18n.changeLanguage(savedLanguage);
            }
        };
        loadLanguage();
    }, [i18n]);

    useEffect(() => {
        if (language) {
            const saveLanguage = async (newLanguage: string) => {
                await AsyncStorage.setItem('language', newLanguage);
                i18n.changeLanguage(newLanguage);
            };
            saveLanguage(language as string);
        }
    }, [language, i18n]);

    if (language === null) {
        return (
            <View style={{
                flex: 1,
                width: windowWidth,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#353535',
            }}>
                <ActivityIndicator size="large" color={Color.BUTTON_RED} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{
                flex: 0.3,
                top: 24,
                width: windowWidth,
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginVertical: 34,
                gap: 16,
            }}>
                <View style={styles.radioContainer}>
                    <Text style={{ color: Color.WHITE }}>English</Text>
                    <RadioButton
                        containerSize={24}
                        selected={language === 'en'}
                        onChange={() => setLanguage('en')}
                    />
                </View>
                <View style={styles.radioContainer}>
                    <Text style={{ color: Color.WHITE }}>Русский</Text>
                    <RadioButton
                        containerSize={24}
                        selected={language === 'ru'}
                        onChange={() => setLanguage('ru')}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
        gap: 16,
        height: 48,
    },
    text: {
        color: Color.WHITE,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20.8,
    }
});