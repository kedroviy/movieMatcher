import { FC } from "react";
import { StyleSheet, TouchableOpacity, Text, View} from "react-native";
import { useDispatch } from "react-redux";

import { logout } from "../../redux/authSlice";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const MainScreen: FC = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, color: '#FFF' }}>main page</Text>
            <TouchableOpacity style={{ width: 100, height: 48 }} onPress={handleLogout} testID='myButton'>
                <Text style={{ fontSize: 20, color: '#FFF' }}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}
