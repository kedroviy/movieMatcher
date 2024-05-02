import { FC, useState } from "react"
import { useTranslation } from "react-i18next";
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/configure-store";
import { fetchUserProfile, updateUsername } from "redux/userSlice";
import { AppConstants, SimpleInput } from "shared"

export const UPChangeName: FC = () => {
    const { t } = useTranslation();
    const { user, loading } = useSelector((state: RootState) => state.userSlice);
    const dispatch: AppDispatch = useDispatch();
    const windowWidth = Dimensions.get('window').width;
    const [name, onChangeName] = useState<string>(AppConstants.EMPTY_VALUE);
    const [isFormValidInput, setIsFormValidInput] = useState<boolean>(false);

    const handleValidationInput = (isValid: boolean) => {
        setIsFormValidInput(isValid);
    };

    const handleSubmit = () => {
        if (name.trim() && user?.id) {
            dispatch(updateUsername({ userId: user.id, newUsername: name }))
                .unwrap()
                .then((updatedUser) => {
                    dispatch(fetchUserProfile())
                })
                .catch((errorResponse: any) => {
                    console.log(errorResponse)
                });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container,
            { width: windowWidth }]}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', alignItems: 'center' }}
            >
                <SimpleInput
                    label={t('acc_settings.changeName.label')}
                    onChangeText={onChangeName}
                    onValidationChange={handleValidationInput}
                    value={name}
                    placeholder={user?.username}
                    textError={t('acc_settings.changeName.textError')}
                />

                <TouchableOpacity
                    style={[styles.button,
                    (isFormValidInput) ?
                        { backgroundColor: '#ED0E0E', width: windowWidth - 32, height: 48 } :
                        { backgroundColor: '#940C0C', width: windowWidth - 32, height: 48 }
                    ]}
                    disabled={(isFormValidInput) ? false : true}
                    onPress={() => handleSubmit()}
                    testID='myButton'
                >
                    <Text style={styles.text}>Войти</Text>
                </TouchableOpacity>
            </ScrollView>
            {/* {loading ? <Loader /> : null} */}
        </KeyboardAvoidingView >
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 48,
        gap: 10,
        borderRadius: 5,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 21.6,
    },
});