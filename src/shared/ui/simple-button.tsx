import { FC } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { radius } from 'styles/theme';

type WidthType = number | `${number}%` | undefined;

type SimpleButtonType = {
    title: string;
    color: string;
    titleColor: string;
    buttonWidth: WidthType;
    onHandlePress: () => void;
    buttonStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
};

export const SimpleButton: FC<SimpleButtonType> = ({
    title,
    color,
    onHandlePress,
    titleColor,
    buttonWidth,
    buttonStyle,
    titleStyle,
    disabled,
}) => {
    return (
        <TouchableOpacity
            testID="simple-button"
            style={[
                styles.button,
                {
                    flexDirection: 'row',
                    width: buttonWidth,
                    minHeight: 48,
                    backgroundColor: color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                },
                buttonStyle,
            ]}
            onPress={onHandlePress}
            disabled={disabled}
        >
            <Text
                style={[
                    {
                        color: titleColor,
                        fontSize: 18,
                        fontWeight: '500',
                        textAlign: 'center',
                        width: '100%',
                    },
                    titleStyle,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: radius.md,
    },
});
