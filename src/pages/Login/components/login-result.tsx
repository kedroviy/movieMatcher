import { FC } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "app/constants";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = StackScreenProps<RootStackParamList, 'LoginResult'>;

export const LoginResult: FC<Props> = ({ route }) => {
    const { icon, resultText, buttonText, buttonColor, onHandlePress } = route.params;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                width: windowWidth,
                paddingHorizontal: 16,
                paddingVertical: 32,
                flex: 1,
            }}>

                <View style={{
                    flex: 0.55,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: windowWidth,
                    paddingHorizontal: 16,
                }}
                >
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 100,
                        height: 100,
                        backgroundColor: '#ED0E0E',
                        borderRadius: 50,
                        marginBottom: 34,
                    }}>
                        {icon}
                    </View>
                    <Text style={{
                        fontFamily: 'Roboto',
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: '400',
                        lineHeight: 20.8,
                        color: '#F9F9F9',
                        marginBottom: 12
                    }}
                    >
                        {resultText}
                    </Text>
                </View>



                <TouchableOpacity
                    style={[styles.button, { backgroundColor: buttonColor, width: windowWidth - 32 }]}
                    testID='myButton'
                    onPress={onHandlePress}
                >
                    <Text style={styles.text}>{buttonText}</Text>
                </TouchableOpacity>


            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        padding: 10,
        gap: 10,
        borderRadius: 5,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 21.6,
    },
});