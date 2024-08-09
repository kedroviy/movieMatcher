import { FC } from "react"
import { ActivityIndicator, View } from "react-native"
import { Color } from "styles/colors"

export const Loader: FC = () => {
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
        }}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                opacity: 0.5,
                width: '100%',
                height: '100%',
                backgroundColor: Color.NEW_BLACK,
            }} />
            <ActivityIndicator size="large" color={Color.BUTTON_RED} />
        </View>
    )
}
