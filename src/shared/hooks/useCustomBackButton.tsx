import { useEffect } from 'react';
import { Alert } from 'react-native';

export const useCustomBackButton = (navigation: any, callback: any) => {
    useEffect(() => {
        const onBeforeRemove = (e: { preventDefault: () => void; data: { action: any; }; }) => {

            e.preventDefault();

            Alert.alert(
                'Discard changes?',
                'You have unsaved changes. Are you sure you want to discard them and leave the screen?',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => { } },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => {
                            const result = callback();
                            if (result && typeof result.then === 'function') {
                                result.catch((err: { message: any; }) => {
                                    console.error("Error during navigation callback:", err.message);
                                });
                            }
                        }
                    }
                ]
            );
        };

        const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove);

        return unsubscribe;
    }, [callback, navigation]);
}
