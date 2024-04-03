import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { AppRoutes } from "app/constants";
import { FC, ReactElement } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { ChevronRightSVGIcon } from "shared"
import { Color } from "styles/colors";

type UPMenuItemsTYpe = {
    name: string;
    iconComponent: ReactElement,
    navigateScreen?: string;
}
export const UPMenuItems: FC<UPMenuItemsTYpe> = ({ iconComponent, name, navigateScreen }) => {
    const windowWidth = Dimensions.get('window').width;
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    let navigationScreen = navigateScreen!;

    const onNavigate = (screen: string) => navigation.navigate(
        AppRoutes.PROFILE_NAVIGATOR, {
        screen: screen,
    });

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
                onPress={() => onNavigate(navigationScreen)}
            >
                <ChevronRightSVGIcon />
            </TouchableOpacity>
        </View>
    )
}