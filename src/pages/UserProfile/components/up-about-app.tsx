import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { UPMenuItems } from "../ui";
import { Color } from "styles/colors";
import { useLocalizedMenuItems } from "../hooks";

export const UPAboutApplication: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const { appVersion } = useSelector((state: any) => state.appSlice);
    const { aboutAppItems } = useLocalizedMenuItems();
    const { t } = useTranslation();
    
    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{
                flex: 0.28,
                width: windowWidth,
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginVertical: 34,
            }}>
                <View style={{
                    width: 80,
                    height: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: Color.BLACK,
                    backgroundColor: Color.NEW_BLACK,
                    marginBottom: 16,
                }}>
                    <Text style={{
                        fontSize: 32,
                        fontWeight: '700',
                        lineHeight: 38.4,
                        letterSpacing: 0.25,
                        color: Color.BUTTON_RED,
                    }}>
                        MM
                    </Text>
                </View>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: '400',
                        lineHeight: 20.8,
                        color: Color.WHITE,
                    }}>
                    {t('about_app.version')} {appVersion}
                </Text>
            </View>
            <View style={{
                flex: 0.5,
                alignItems: 'stretch',
                width: windowWidth,
                bottom: 50,
            }}>
                {aboutAppItems.map((item) => {
                    return <UPMenuItems key={item.id} {...item} />
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});