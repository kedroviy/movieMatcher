import { FC } from "react";
import { View, Text } from "react-native";

export type SMMovieChipsType = {
    label: string | number;
    color: string;
    labelColor: string;
    type: 'time' | 'age';
}

export const SMMovieChips: FC<SMMovieChipsType> = ({ label, color, labelColor, type }) => {
    return (
        <View style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color,
            borderRadius: 5,
            marginRight: 12,
        }}>
            <Text style={{
                fontSize: 12,
                color: labelColor,
                fontWeight: '500',
                lineHeight: 15.6
            }}>
                {type === 'time' ? `${label} мин` : (type === 'age' ? `${label}+` : label)}
            </Text>
        </View>
    )
}