import { FC, useState } from "react";
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import { Color } from "styles/colors";

type RadioButtonType = {
    containerSize: number;
};

export const RadioButton: FC<RadioButtonType> = ({ containerSize }) => {
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: containerSize,
            height: containerSize,
            borderRadius: containerSize / 2,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: Color.GREY,
        }}>
            <TouchableOpacity style={{
                width: containerSize - 8,
                height: containerSize - 8,
                borderRadius: (containerSize - 5) / 2,
                backgroundColor: Color.GREY,
            }}
                onPress={() => setSelected(true)}
            >
            </TouchableOpacity>
        </View>
    )
}