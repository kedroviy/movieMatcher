import { FC } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { UPMenuItems } from "../ui";
import { aboutAppItems } from "../constants";
import { Color } from "styles/colors";
import { useSelector } from "react-redux";

export const UPAboutApplication: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const { appVersion } = useSelector((state: any) => state.appSlice);

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
                    Версия {appVersion}
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
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'center',
    },
});