import { FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { MovieLoader, RadioButton, saveToken } from 'shared';
import { Color } from 'styles/colors';
import { updateUserLanguage } from 'features/auth/authAPI';
import {
    applyUserLanguageLocally,
    getStoredUserLanguage,
    type UserLanguage,
} from 'shared/utils/user-language';
import type { RootState } from 'redux/configure-store';

export const UPLanguage: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const [language, setLanguage] = useState<UserLanguage | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { i18n } = useTranslation();
    const isAuthenticated = useSelector((state: RootState) => state.authSlice.isAuthenticated);

    useEffect(() => {
        const loadLanguage = async () => {
            const savedLanguage = await getStoredUserLanguage();
            setLanguage(savedLanguage);
            await i18n.changeLanguage(savedLanguage);
        };
        void loadLanguage();
    }, [i18n]);

    const selectLanguage = useCallback(
        async (next: UserLanguage) => {
            if (language === next || isSaving) {
                return;
            }
            const previous = language;
            setLanguage(next);
            setIsSaving(true);
            try {
                await applyUserLanguageLocally(next);
                if (isAuthenticated) {
                    const result = await updateUserLanguage(next);
                    if (result.success) {
                        await saveToken(result.token);
                    } else if (previous != null) {
                        setLanguage(previous);
                        await applyUserLanguageLocally(previous);
                    }
                }
            } finally {
                setIsSaving(false);
            }
        },
        [isAuthenticated, isSaving, language],
    );

    if (language === null) {
        return (
            <View
                style={{
                    flex: 1,
                    width: windowWidth,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#353535',
                }}
            >
                <MovieLoader />
            </View>
        );
    }

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View
                style={{
                    flex: 0.3,
                    top: 24,
                    width: windowWidth,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginVertical: 34,
                    gap: 16,
                }}
            >
                {isSaving ? <ActivityIndicator color={Color.ACCENT_2} /> : null}
                <View style={styles.radioContainer}>
                    <Text style={{ color: Color.WHITE }}>English</Text>
                    <RadioButton
                        containerSize={24}
                        selected={language === 'en'}
                        onChange={() => {
                            void selectLanguage('en');
                        }}
                    />
                </View>
                <View style={styles.radioContainer}>
                    <Text style={{ color: Color.WHITE }}>Русский</Text>
                    <RadioButton
                        containerSize={24}
                        selected={language === 'ru'}
                        onChange={() => {
                            void selectLanguage('ru');
                        }}
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
    },
});
