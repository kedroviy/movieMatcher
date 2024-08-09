import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { AppRoutes } from "app/constants";
import { FC, ReactElement } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { ChevronRightSVGIcon } from "shared"
import { Color } from "styles/colors";

type UPMenuItemsTYpe = {
    name: string;
    subName?: string;
    iconComponent?: ReactElement,
    navigateScreen?: string;
}
export const UPMenuItems: FC<UPMenuItemsTYpe> = ({ iconComponent, name, navigateScreen, subName }) => {
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
            <View style={{marginRight: 12}}>
                {iconComponent}
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '85%',
                overflow: 'hidden',
            }}>
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
                {subName ?
                    <Text style={{
                        fontFamily: 'Roboto',
                        fontSize: 14,
                        lineHeight: 18.2,
                        fontWeight: '400',
                        color: Color.GREY,
                    }}>
                        {subName}
                    </Text>
                    : null}
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