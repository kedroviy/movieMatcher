import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from 'redux/appSlice';
import { AppDispatch, RootState } from 'redux/configure-store';
import { NotificationType } from 'shared/config';
import { CrossSvgIcon, ErrorSvgIcon, SuccessSvgIcon, WarningSvgIcon } from '.';
import { Color } from 'styles/colors';

const { width } = Dimensions.get('window');

export const StatusNotification: React.FC = () => {
    const notifications = useSelector((state: RootState) => state.appSlice.notifications);
    const dispatch: AppDispatch = useDispatch();

    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        if (notifications.length > 0) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    dispatch(removeNotification(notifications[0].id));
                });
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [notifications]);

    const getTextColor = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return Color.GREEN;
            case 'error':
                return Color.BUTTON_RED;
            case 'warning':
                return Color.ORANGE;
            default:
                return 'rgba(0,0,0,1)';
        }
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return <SuccessSvgIcon />;
            case 'error':
                return <ErrorSvgIcon />;
            case 'warning':
                return <WarningSvgIcon />;
            default:
                return null;
        }
    };

    return (
        <>
            {notifications.map((notification) => (
                <View
                    key={notification.id}
                    style={styles.container}>
                    <Animated.View style={[
                        styles.notificationBox,
                        { opacity: fadeAnim },
                    ]}>
                        {getIcon(notification.type)}
                        <Text style={[styles.text, { color: getTextColor(notification.type) }]}>
                            {notification.message}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => dispatch(removeNotification(notification.id))}
                        >
                            <CrossSvgIcon />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBox: {
        width: width - 32,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    text: {
        fontSize: 14,
        flex: 1,
        marginLeft: 10,
    },
    closeButton: {
        marginLeft: 10,
    },
    closeText: {
        color: 'white',
        fontWeight: 'bold',
    },
});