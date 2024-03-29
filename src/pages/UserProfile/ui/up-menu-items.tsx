import { FC, ReactElement } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { ChevronRightSVGIcon } from "shared"
import { Color } from "styles/colors";

type UPMenuItemsTYpe = {
    name: string;
    onHandlePress: () => void;
    iconComponent: ReactElement,
}
export const UPMenuItems: FC<UPMenuItemsTYpe> = ({ iconComponent, name, onHandlePress }) => {
    const windowWidth = Dimensions.get('window').width;
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: windowWidth,
            paddingHorizontal: 24,
            marginBottom: 16,
            height: 46,
        }}>
            {iconComponent}
            <View style={{ justifyContent: 'flex-start', width: '75%' }}>
                <Text style={{
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    lineHeight: 20.8,
                    fontWeight: '400',
                    color: Color.WHITE,
                }}  
                >
                    {name}
                </Text>
            </View>
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 36,
                    height: 36
                }}
                onPress={onHandlePress}
            >
                <ChevronRightSVGIcon />
            </TouchableOpacity>
        </View>
    )
}