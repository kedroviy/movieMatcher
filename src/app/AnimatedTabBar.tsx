import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Color } from 'styles/colors';
import { borderSubtle, radius } from 'styles/theme';

const TAB_BAR_HEIGHT = 72;
const TAB_BAR_PADDING_TOP = 8;
const TAB_BAR_PADDING_BOTTOM = 8;
const TAB_HORIZONTAL_INSET = 35;
const SPRING = { damping: 20, stiffness: 260 };

type TabBarButtonProps = {
    children: React.ReactNode;
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    style?: StyleProp<ViewStyle>;
    accessibilityLabel?: string;
};

const TabBarButton = ({ children, onPress, onLongPress, isFocused, style, accessibilityLabel }: TabBarButtonProps) => {
    const scale = useSharedValue(isFocused ? 1 : 0.92);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0.92, SPRING);
    }, [isFocused, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tab, style]}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={accessibilityLabel}
        >
            <Animated.View style={[styles.tabInner, animatedStyle]}>{children}</Animated.View>
        </Pressable>
    );
};

export const AnimatedTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const { width } = useWindowDimensions();
    const tabCount = state.routes.length;
    const tabWidth = width / tabCount;
    const indicatorWidth = tabWidth - TAB_HORIZONTAL_INSET * 2;
    const indicatorHeight = TAB_BAR_HEIGHT - TAB_BAR_PADDING_TOP - TAB_BAR_PADDING_BOTTOM;
    const indicatorLeft = (tabWidth - indicatorWidth) / 2;

    const indicatorX = useSharedValue(state.index * tabWidth + indicatorLeft);

    useEffect(() => {
        indicatorX.value = withSpring(state.index * tabWidth + indicatorLeft, SPRING);
    }, [state.index, tabWidth, indicatorLeft, indicatorX]);

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: indicatorX.value }],
        width: indicatorWidth,
        height: indicatorHeight,
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.indicator, indicatorStyle]} />
            <View style={styles.tabsRow}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const label =
                        typeof options.tabBarLabel === 'string'
                            ? options.tabBarLabel
                            : (options.title ?? route.name);
                    const color = isFocused ? Color.BUTTON_RED : Color.GREY;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarButton
                            key={route.key}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            isFocused={isFocused}
                            style={{ width: tabWidth }}
                            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                        >
                            <View style={styles.tabContent}>
                                {options.tabBarIcon?.({
                                    focused: isFocused,
                                    color,
                                    size: 24,
                                })}
                                <Text style={[styles.label, { color }, isFocused && styles.labelFocused]}>{label}</Text>
                            </View>
                        </TabBarButton>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: TAB_BAR_HEIGHT,
        backgroundColor: Color.EXTRA_DARK_GRAY,
        borderTopWidth: 1,
        borderTopColor: borderSubtle,
        paddingTop: TAB_BAR_PADDING_TOP,
        paddingBottom: TAB_BAR_PADDING_BOTTOM,
    },
    tabsRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    indicator: {
        position: 'absolute',
        top: TAB_BAR_PADDING_TOP,
        borderRadius: radius.pill,
        backgroundColor: 'rgba(220, 38, 38, 0.14)',
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        paddingHorizontal: 4,
        minHeight: TAB_BAR_HEIGHT - TAB_BAR_PADDING_TOP - TAB_BAR_PADDING_BOTTOM,
    },
    label: {
        fontSize: 11,
        fontWeight: '400',
        fontFamily: 'Roboto',
        letterSpacing: 0.2,
        opacity: 0.85,
    },
    labelFocused: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 1,
    },
});
