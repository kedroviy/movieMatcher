import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF5F1',
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
    },
});

export const LoginScreen = () => {
    const onPress = () => console.log('button work');
    return (
        <View style={styles.container}>
            <Text>Login page</Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text>Press Here</Text>
            </TouchableOpacity>
        </View>
    )
}
