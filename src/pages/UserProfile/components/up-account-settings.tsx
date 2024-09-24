import { FC, useState } from "react"
import { View, StyleSheet, Dimensions, Text, Modal, Pressable } from "react-native"
import { useTranslation } from "react-i18next";

import { useLocalizedMenuItems } from "../hooks";
import { SimpleButton } from "shared";
import { UPMenuItems } from "../ui";
import { Color } from "styles/colors";
import { useDispatch } from "react-redux";
import { AppDispatch } from "redux/configure-store";
import { logout } from "redux/authSlice";
import { UPDAModal } from "../ui/up-da-modal";

export const UPAccountSettings: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const dispatch: AppDispatch = useDispatch();
    const { accountSettingsItems } = useLocalizedMenuItems();
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{
                flex: 0.4,
                alignItems: 'stretch',
                width: windowWidth,
                top: 24,

            }}>
                {accountSettingsItems.map((item) => {
                    return <UPMenuItems key={item.id} {...item} />
                })}
            </View>
            <View style={{
                flex: 0.3,
                alignItems: 'stretch',
                width: windowWidth - 32,
                gap: 8,
            }}>
                <Text style={styles.text}>Danger Zone</Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderColor: Color.BUTTON_RED,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 12,
                }}>
                    <Text style={{
                        color: Color.WHITE,
                        fontSize: 14,
                    }}>
                        Delete your account
                    </Text>
                    <SimpleButton
                        title='Delete'
                        color={Color.SYSTEM_GREY}
                        titleColor={Color.WHITE}
                        onHandlePress={() => setIsModalVisible(prevState => !prevState)}
                        buttonWidth={100}
                    />
                </View>
            </View>
            <SimpleButton
                title={t('acc_settings.logout_acc')}
                color={Color.BUTTON_RED}
                titleColor={Color.WHITE}
                onHandlePress={handleLogout}
                buttonWidth={windowWidth - 32}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}>
                <UPDAModal onHandlePress={() => setIsModalVisible(prevState => !prevState)} />
            </Modal>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
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
    },
});