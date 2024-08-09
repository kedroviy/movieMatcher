import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Color } from 'styles/colors';

type MatchStatusCardType = {
    containerStyle?: any;
    imageSource: any;
    title: string;
    description: string;
    buttonText?: string;
    onPressButton?: () => void;
};

export const MatchStatusCard: React.FC<MatchStatusCardType> = ({
    containerStyle,
    imageSource,
    title,
    description,
    buttonText,
    onPressButton,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 200,
                height: 300,
                borderRadius: 50,
                marginBottom: 34,
            }}>
                {imageSource}
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            {buttonText && onPressButton && (
                <TouchableOpacity style={styles.button} onPress={onPressButton}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    title: {
        color: Color.WHITE,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: Color.WHITE,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
