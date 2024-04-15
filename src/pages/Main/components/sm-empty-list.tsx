import { View, Image, Text, StyleSheet } from "react-native";
import { Color } from "styles/colors";


export const EmptyListComponent = () => (
    <View style={styles.emptyStateContainer}>
        <Image source={require('../../../../assets/image33.png')}/>
        <Text style={styles.emptyStateText}>Ваш список фильмов пуст</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.BACKGROUND_GREY,
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        marginTop: 20,
        fontSize: 18,
        color: Color.WHITE,
    },
    image: {
        width: 100,
        height: 100,
    },
    text: {
        color: Color.WHITE,
        fontSize: 18,
    },
});