import { FC } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "redux/authSlice";
import { UPAvatarContainer, UPMenuItems } from "./ui";
import { useLocalizedMenuItems } from "./hooks";

const fakeImage = 'https://drive.google.com/uc?export=download&id=1XyvtSH--FxiGK67-Q9pPcKRCYxDfqGfF'

export const UserProfileScreen: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const dispatch = useDispatch();
    const { menuItems } = useLocalizedMenuItems();

    const handleLogout = () => {
        dispatch(logout());
    };

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
                    name='Enagtim'
                    subName='122134'
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
            <TouchableOpacity style={{ width: 100, height: 48 }} onPress={handleLogout} testID='myButton'>
                <Text style={{ fontSize: 20, color: '#FFF' }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'center',
    },
});