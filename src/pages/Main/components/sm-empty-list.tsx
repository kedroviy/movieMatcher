import { useTranslation } from "react-i18next";
import { View, Image, Text, StyleSheet } from "react-native";
import { Color } from "styles/colors";


export const EmptyListComponent = () => {
    const { t } = useTranslation();

    return (
        <View style={styles.emptyStateContainer}>
            <Image source={require('../../../../assets/image52.png')} />
            <Text style={styles.emptyStateText}>{t('selection_movie.empty_list')}</Text>
        </View>
    );
};

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
        textAlign: 'center',
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