import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native"

type WidthType = number | `${number}%` | undefined;

type SimpleButtonType = {
    title: string;
    color: string;
    titleColor: string,
    buttonWidth: WidthType,
    onHandlePress: () => void,
    buttonStyle?: ViewStyle,
};

export const SimpleButton: FC<SimpleButtonType> =
    ({ title, color, onHandlePress, titleColor, buttonWidth, buttonStyle }) => {

        return (
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        flexDirection: 'row',
                        width: buttonWidth,
                        height: 48,
                        backgroundColor: color,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    buttonStyle
                ]}
                onPress={onHandlePress}
            >
                <Text style={{
                    color: titleColor,
                    fontSize: 18,
                    fontWeight: '500',
                }}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        )
    };

const styles = StyleSheet.create({
    button: {
        padding: 10,
        width: 328,
        height: 44,
        gap: 10,
        borderRadius: 5,
    },
});