import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

export const useCustomBackButton = (navigation: any, callback: any) => {
    const { t } = useTranslation();

    useEffect(() => {
        const onBeforeRemove = (e: { preventDefault: () => void; data: { action: any } }) => {
            e.preventDefault();

            Alert.alert(t('prompts.discard_title'), t('prompts.discard_body'), [
                    { text: t('prompts.dont_leave'), style: 'cancel', onPress: () => {} },
                    {
                        text: t('prompts.discard'),
                        style: 'destructive',
                        onPress: () => {
                            const result = callback();
                            if (result && typeof result.then === 'function') {
                                result.catch((err: { message: any }) => {
                                    console.error('Error during navigation callback:', err.message);
                                });
                            }
                        },
                    },
                ],
            );
        };

        const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove);

        return unsubscribe;
    }, [callback, navigation, t]);
};
