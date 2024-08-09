import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native"
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { AppRoutes } from "app/constants";
import { FC, useState } from "react"
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/configure-store";
import { updateUsername } from "redux/userSlice";
import { AppConstants, CheckSvgIcon, SimpleInput } from "shared"
import { Color } from "styles/colors";

export const UPChangeName: FC = () => {
    const { t } = useTranslation();
    const { user, loading } = useSelector((state: RootState) => state.userSlice);
    const dispatch: AppDispatch = useDispatch();
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const windowWidth = Dimensions.get('window').width;
    const [name, onChangeName] = useState<string>(AppConstants.EMPTY_VALUE);
    const [isFormValidInput, setIsFormValidInput] = useState<boolean>(false);

    const handleValidationInput = (isValid: boolean) => {
        setIsFormValidInput(isValid);
    };

    const handleSubmit = async () => {
        if (name.trim() && user?.id) {
            const actionResult = await dispatch(updateUsername({ userId: user.id, newUsername: name }));

            try {
                if (updateUsername.fulfilled.match(actionResult)) {
                    navigation.navigate(
                        AppRoutes.PROFILE_RESULT, {
                        icon: <CheckSvgIcon />,
                        resultText: t('acc_settings.changeName.success'),
                        buttonText: t('general.continue'),
                        buttonColor: Color.BUTTON_RED,
                        onHandlePress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [
                                    { name: AppRoutes.USER_PROFILE_ACC_SETTINGS },
                                ],
                            })
                        },
                    });
                }
            } catch (errorResponse) {
                console.error('Error response:', errorResponse);
                Alert.alert(t('errorTitle'), t('errorMessage'));
            }
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
                    <Text style={styles.text}>{t('acc_settings.changeName.change_name')}</Text>
                </TouchableOpacity>
            </ScrollView>
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