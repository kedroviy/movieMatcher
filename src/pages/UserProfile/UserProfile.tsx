import { FC } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

export const UserProfileScreen: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <Text>
                User-profile
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#595959',
        padding: 10,
        width: 328,
        height: 44,
        gap: 10,
        borderRadius: 5,
    },
});