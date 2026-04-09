import { FC } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Color } from 'styles/colors';

export const Loader: FC = () => {
    return (
        <View style={styles.root}>
            <View style={styles.dim} />
            <ActivityIndicator size="large" color={Color.BUTTON_RED} />
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dim: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.5,
        backgroundColor: Color.NEW_BLACK,
    },
});
