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
    disabled?: boolean;
};

export const SimpleButton: FC<SimpleButtonType> =
    ({ title, color, onHandlePress, titleColor, buttonWidth, buttonStyle, disabled }) => {

        return (
            <TouchableOpacity
                testID="simple-button"
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
                disabled={disabled}
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