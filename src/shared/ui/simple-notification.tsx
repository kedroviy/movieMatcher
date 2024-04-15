import { FC } from "react"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import { Color } from "styles/colors";
import { SimpleButton } from "./simple-button";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

type SimpleNotificationType = {
    icon: JSX.Element;
    label: string;
    description: string;
    buttonText: string;
    buttonColor: string;
    onHandlePress: () => void;
};

const { width, height } = Dimensions.get('window');

export const SimpleNotification: FC<SimpleNotificationType> = ({
    icon,
    label,
    description,
    buttonText,
    buttonColor,
    onHandlePress
}) => {
    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                width: width,
                height: height,
            }}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                opacity: 0.7,
                width: '100%',
                height: '100%',
                backgroundColor: Color.NEW_BLACK,
            }} />
            <Animated.View
                entering={SlideInDown.springify().damping(18)}
                exiting={SlideOutDown.springify().damping(20)}
                style={styles.container}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36
                }}>
                    {icon}
                </View>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.description}>{description}</Text>
                <SimpleButton
                    title={buttonText}
                    color={buttonColor}
                    titleColor={Color.WHITE}
                    onHandlePress={onHandlePress}
                    buttonWidth={'100%'}
                />
            </Animated.View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 328,
        paddingHorizontal: 24,
        paddingVertical: 32,
        marginBottom: 5,
        borderRadius: 10,
        backgroundColor: Color.WHITE,
        gap: 16,
    },
    label: {
        fontSize: 20,
        fontFamily: 'Roboto',
        fontWeight: '700',
        lineHeight: 24,
        color: Color.BLACK,
        marginBottom: 8,
    },
    description: {
        color: Color.DESCRIPTION_GREY,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 15.6,
        marginBottom: 10,
    }
});