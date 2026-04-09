import { useTranslation } from 'react-i18next';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Color } from 'styles/colors';
import { contentWidth, spacing } from 'styles/theme';

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
        paddingHorizontal: spacing.sm,
        maxWidth: contentWidth,
    },
    emptyStateText: {
        marginTop: spacing.lg,
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
        color: Color.SYSTEM_GREY,
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
