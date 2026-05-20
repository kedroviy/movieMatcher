import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { AppRoutes } from './constants';
import { Color } from 'styles/colors';
import { borderSubtle, radius } from 'styles/theme';

const TAB_BAR_HEIGHT = 72;
const TAB_BAR_PADDING_TOP = 8;
const TAB_BAR_PADDING_BOTTOM = 8;
const TAB_HORIZONTAL_INSET = 35;
const TAB_ICON_SIZE = 24;
const HERO_ICON_SIZE = 26;
const SPRING = { damping: 20, stiffness: 260 };

const getTabColor = (isHeroTab: boolean, isFocused: boolean) => {
    if (isFocused) {
        return Color.BUTTON_RED;
    }
    if (isHeroTab) {
        return Color.FADED_WHITE;
    }
    return Color.GREY;
};

type TabBarButtonProps = {
    children: React.ReactNode;
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    style?: StyleProp<ViewStyle>;
    accessibilityLabel?: string;
};

const TabBarButton = ({ children, onPress, onLongPress, isFocused, style, accessibilityLabel }: TabBarButtonProps) => {
    const scale = useSharedValue(isFocused ? 1 : 0.96);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0.96, SPRING);
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
                    const isHeroTab = route.name === AppRoutes.MATCH_SCREEN;
                    const label =
                        typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title ?? route.name;
                    const color = getTabColor(isHeroTab, isFocused);
                    const iconSize = isHeroTab ? HERO_ICON_SIZE : TAB_ICON_SIZE;
                    const isMuted = !isFocused && !isHeroTab;

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
                            <View style={[styles.tabContent, isMuted && styles.tabContentMuted]}>
                                {options.tabBarIcon?.({
                                    focused: isFocused,
                                    color,
                                    size: iconSize,
                                })}
                                <Text
                                    style={[
                                        styles.label,
                                        isHeroTab && styles.heroLabel,
                                        { color },
                                        isFocused && styles.labelFocused,
                                        isMuted && styles.labelMuted,
                                    ]}
                                >
                                    {label}
                                </Text>
                                {isHeroTab ? (
                                    <View
                                        style={[
                                            styles.heroAccent,
                                            isFocused ? styles.heroAccentFocused : styles.heroAccentIdle,
                                        ]}
                                    />
                                ) : null}
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
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
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
        gap: 4,
        paddingHorizontal: 4,
        minHeight: TAB_BAR_HEIGHT - TAB_BAR_PADDING_TOP - TAB_BAR_PADDING_BOTTOM,
    },
    tabContentMuted: {
        opacity: 0.55,
    },
    heroAccent: {
        marginTop: 1,
        borderRadius: radius.pill,
        backgroundColor: Color.BUTTON_RED,
    },
    heroAccentIdle: {
        width: 20,
        height: 2,
        opacity: 0.55,
    },
    heroAccentFocused: {
        width: 28,
        height: 3,
        opacity: 1,
    },
    heroLabel: {
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    label: {
        fontSize: 11,
        fontWeight: '400',
        fontFamily: 'Roboto',
        letterSpacing: 0.2,
    },
    labelMuted: {
        opacity: 0.9,
    },
    labelFocused: {
        fontSize: 12,
        fontWeight: '600',
    },
});
