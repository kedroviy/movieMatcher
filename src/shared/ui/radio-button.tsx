import { FC } from "react";
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import { Color } from "styles/colors";

type RadioButtonType = {
    containerSize: number;
    selected: boolean;
    onChange: () => void;
};

export const RadioButton: FC<RadioButtonType> = ({ containerSize, selected, onChange }) => {
    return (
        <View
            testID="radio-container"
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: containerSize,
                height: containerSize,
                borderRadius: containerSize / 2,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: Color.WHITE,
            }}>
            <TouchableOpacity
                testID="radio-button"
                style={{
                    width: containerSize / 2,
                    height: containerSize / 2,
                    borderRadius: containerSize / 2,
                    backgroundColor: selected ? Color.WHITE : 'transparent',
                }}
                onPress={onChange}
            >
            </TouchableOpacity>
        </View>
    )
}