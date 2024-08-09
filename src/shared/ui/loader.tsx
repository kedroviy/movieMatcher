import { FC } from "react"
import { ActivityIndicator, View } from "react-native"

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
                backgroundColor: '#353535',
            }} />
            <ActivityIndicator size="large" color="#B3B3B3" />
        </View>
    )
}
