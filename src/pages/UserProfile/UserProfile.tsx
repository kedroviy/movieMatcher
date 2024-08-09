import { FC } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { UPAvatarContainer, UPMenuItems } from "./ui";
import { useLocalizedMenuItems } from "./hooks";
import { Color } from "styles/colors";
import useFetchUserProfile from "shared/hooks/getUserProfile";

const fakeImage = 'https://drive.google.com/uc?export=download&id=1XyvtSH--FxiGK67-Q9pPcKRCYxDfqGfF'

export const UserProfileScreen: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const { menuItems } = useLocalizedMenuItems();
    const { user, loading: userLoading, error: userError } = useFetchUserProfile();

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{
                flex: 0.28,
                width: windowWidth,
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginVertical: 24,
            }}
            >
                <UPAvatarContainer
                    name={user?.username as string}
                    subName={user?.id as any}
                    imageUrl={fakeImage}
                />
            </View>
            <View style={{
                flex: 0.5,
                alignItems: 'stretch',
                width: windowWidth,
            }}
            >
                {menuItems.map((item) => {
                    return <UPMenuItems key={item.id} {...item} />
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.BACKGROUND_GREY,
        flex: 1,
        alignItems: 'center',
    },
});