import { FC } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { PencilSvgIcon } from "shared"
import { Color } from "styles/colors"

type UPAvatarContainerType = {
    imageUrl: string,
    name: string,
    subName: string,
}
export const UPAvatarContainer: FC<UPAvatarContainerType> = ({ imageUrl, name, subName }) => {
    return (
        <View style={{
            width: 90,
            height: 90,
            backgroundColor: Color.BLACK,
            borderRadius: 60,
            alignItems: 'center',
            justifyContent: 'space-between',
        }}
        >
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    borderRadius: 60,
                }}
            >
                <Image
                    style={{
                        width: '120%',
                        height: '120%',
                    }}
                    source={{ uri: imageUrl }}
                    resizeMode='contain'
                />
            </View>
            <TouchableOpacity
                style={{
                    width: 28,
                    height: 28,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Color.LIGHT_BLACK,
                    position: 'absolute',
                    bottom: 0,
                    right: 3,
                    zIndex: 10,
                    borderRadius: 14,
                }}
            >
                <PencilSvgIcon />
            </TouchableOpacity>
            <View style={{ gap: 8, marginTop: 16, alignItems: 'center' }}>
                <Text style={{
                    color: Color.WHITE,
                    fontSize: 16,
                    lineHeight: 20.8,
                }}
                >
                    {name}
                </Text>
                <Text style={{ color: Color.WHITE, }}>id {subName}</Text>
            </View>
        </View>
    )
}