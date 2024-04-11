import { FC } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native"

type SimpleButtonType = {
    title: string;
    color: string;
    titleColor: string,
    onHandlePress: () => void,
};

export const SimpleButton: FC<SimpleButtonType> = ({ title, color, onHandlePress, titleColor }) => {
    const windowWidth = Dimensions.get('window').width;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    flexDirection: 'row',
                    width: windowWidth - 32,
                    height: 48,
                    backgroundColor: color,
                    alignItems: 'center',
                    justifyContent: 'center',
                }
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