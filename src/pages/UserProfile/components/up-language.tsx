import { FC, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { RadioButton } from "shared";


export const UPLanguage: FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const [language, setLanguage] = useState<string>('en');

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <View style={{
                flex: 0.28,
                width: windowWidth,
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginVertical: 34,
            }}>
                {/* <View style={styles.radioContainer}>
                    <RadioButton
                        value={language}
                        selected
                        containerStyle={{ width: '100%' }} />
                    <Text>Русский</Text>
                </View> */}
                <View style={styles.radioContainer}>
                    <Text>English</Text>
                    <RadioButton containerSize={18} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'center',
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: 'green'
    }
});