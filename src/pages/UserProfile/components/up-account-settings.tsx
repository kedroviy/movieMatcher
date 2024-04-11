import { FC } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { useTranslation } from "react-i18next";

import { useLocalizedMenuItems } from "../hooks";
import { SimpleButton } from "shared";
import { UPMenuItems } from "../ui";
import { Color } from "styles/colors";
import { useDispatch } from "react-redux";
import { AppDispatch } from "redux/configure-store";
import { logout } from "redux/authSlice";

export const UPAccountSettings: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const dispatch: AppDispatch = useDispatch();
    const { accountSettingsItems } = useLocalizedMenuItems();
    const { t } = useTranslation();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{
                flex: 0.5,
                alignItems: 'stretch',
                width: windowWidth,
                top: 24,
            }}>
                {accountSettingsItems.map((item) => {
                    return <UPMenuItems key={item.id} {...item} />
                })}
            </View>
            <SimpleButton
                title={t('acc_settings.logout_acc')}
                color={Color.BUTTON_RED}
                titleColor={Color.WHITE}
                onHandlePress={handleLogout}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 32,
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