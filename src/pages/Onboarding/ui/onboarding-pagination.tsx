import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

type OnboardingPaginationType = {
    totalPages: number;
    currentPage: number;
};

export const OnboardingPagination: FC<OnboardingPaginationType> = ({ totalPages, currentPage }) => {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalPages }, (_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        { backgroundColor: index === currentPage ? '#ED0E0E' : '#F9F9F9' }
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 5,
    },
});