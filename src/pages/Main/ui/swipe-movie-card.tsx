import React, { FC, ReactNode, useEffect, useMemo, useRef } from 'react';
import {
    Dimensions,
    Image,
    LayoutChangeEvent,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextLayoutEventData,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Color } from 'styles/colors';
import { getRatingColor, roundDownToOneTenth } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = SCREEN_WIDTH - 28;
export const CARD_HEIGHT = 560;
const POSTER_HEIGHT_COLLAPSED = 340;
const POSTER_HEIGHT_EXPANDED = 272;
const POSTER_HEIGHT_DELTA = POSTER_HEIGHT_COLLAPSED - POSTER_HEIGHT_EXPANDED;
const POSTER_SCRIM_HEIGHT = 220;
const DESCRIPTION_LINE_HEIGHT = 22;
const DESCRIPTION_COLLAPSED_LINES = 4;
const DESCRIPTION_COLLAPSED_HEIGHT = DESCRIPTION_LINE_HEIGHT * DESCRIPTION_COLLAPSED_LINES;
const DESCRIPTION_BUTTON_GAP = 10;
const EXPAND_DURATION_MS = 340;

export type SwipeMovieCardProps = {
    posterUri?: string | null;
    rating?: number | null;
    title: string;
    year?: string | number | null;
    description?: string | null;
    isExpanded: boolean;
    onToggleExpand: () => void;
    expandLabel: string;
    collapseLabel: string;
    chips?: ReactNode;
    unavailable?: boolean;
    unavailableHint?: string;
    style?: ViewStyle;
};

const PosterScrim: FC = () => (
    <Svg width={CARD_WIDTH} height={POSTER_SCRIM_HEIGHT} style={styles.posterScrim}>
        <Defs>
            <LinearGradient id="posterFade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#0A0A0C" stopOpacity="0" />
                <Stop offset="0.55" stopColor="#0A0A0C" stopOpacity="0.15" />
                <Stop offset="1" stopColor="#0A0A0C" stopOpacity="0.92" />
            </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={CARD_WIDTH} height={POSTER_SCRIM_HEIGHT} fill="url(#posterFade)" />
    </Svg>
);

const AccentBar: FC = () => (
    <Svg width={CARD_WIDTH} height={4} style={styles.accentBar}>
        <Defs>
            <LinearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#FF6B6B" />
                <Stop offset="0.45" stopColor="#F06595" />
                <Stop offset="1" stopColor="#845EF7" />
            </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={CARD_WIDTH} height={4} rx={2} fill="url(#accent)" />
    </Svg>
);

export const SwipeMovieCard: FC<SwipeMovieCardProps> = ({
    posterUri,
    rating,
    title,
    year,
    description,
    isExpanded,
    onToggleExpand,
    expandLabel,
    collapseLabel,
    chips,
    unavailable = false,
    unavailableHint,
    style,
}) => {
    const ratingLabel = useMemo(() => {
        if (rating == null || !Number.isFinite(Number(rating))) {
            return '—';
        }
        return roundDownToOneTenth(rating);
    }, [rating]);

    const ratingTint = getRatingColor(rating ?? 0);
    const yearSuffix = year != null && String(year).length > 0 ? String(year) : null;
    const descriptionScrollRef = useRef<ScrollView>(null);
    const expandProgress = useSharedValue(isExpanded ? 1 : 0);
    const collapsedBlockHeight = useSharedValue(0);
    const buttonHeight = useSharedValue(0);
    const collapsedTextHeight = useSharedValue(DESCRIPTION_COLLAPSED_HEIGHT);
    const fullTextHeight = useSharedValue(DESCRIPTION_COLLAPSED_HEIGHT);

    useEffect(() => {
        if (!isExpanded) {
            descriptionScrollRef.current?.scrollTo({ y: 0, animated: false });
        }
        expandProgress.value = withTiming(isExpanded ? 1 : 0, {
            duration: EXPAND_DURATION_MS,
            easing: Easing.out(Easing.cubic),
        });
    }, [expandProgress, isExpanded]);

    const posterAnimatedStyle = useAnimatedStyle(() => ({
        height: interpolate(expandProgress.value, [0, 1], [POSTER_HEIGHT_COLLAPSED, POSTER_HEIGHT_EXPANDED]),
    }));

    const descriptionClipStyle = useAnimatedStyle(() => {
        const collapsedRoom = Math.max(collapsedBlockHeight.value - buttonHeight.value - DESCRIPTION_BUTTON_GAP, 0);
        const collapsedHeight =
            collapsedRoom > 0 ? Math.min(collapsedTextHeight.value, collapsedRoom) : collapsedTextHeight.value;
        const expandedRoom = collapsedRoom > 0 ? collapsedRoom + POSTER_HEIGHT_DELTA : collapsedHeight;
        const expandedHeight = Math.min(Math.max(fullTextHeight.value, collapsedHeight), expandedRoom);
        return {
            height: interpolate(expandProgress.value, [0, 1], [collapsedHeight, expandedHeight]),
        };
    });

    const handleDescriptionBlockLayout = (event: LayoutChangeEvent): void => {
        if (expandProgress.value > 0.001 && collapsedBlockHeight.value > 0) {
            return;
        }
        collapsedBlockHeight.value = event.nativeEvent.layout.height;
    };

    const handleExpandButtonLayout = (event: LayoutChangeEvent): void => {
        buttonHeight.value = event.nativeEvent.layout.height;
    };

    const handleDescriptionTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>): void => {
        const lines = event.nativeEvent.lines;
        if (!lines.length) {
            return;
        }
        const collapsed = lines.slice(0, DESCRIPTION_COLLAPSED_LINES).reduce((sum, line) => sum + line.height, 0);
        const full = lines.reduce((sum, line) => sum + line.height, 0);
        collapsedTextHeight.value = collapsed || DESCRIPTION_COLLAPSED_HEIGHT;
        fullTextHeight.value = full || DESCRIPTION_COLLAPSED_HEIGHT;
    };

    return (
        <View style={[styles.card, style]}>
            <View style={styles.accentBarWrap}>
                <AccentBar />
            </View>

            <Animated.View style={[styles.posterFrame, posterAnimatedStyle]}>
                {unavailable || !posterUri ? (
                    <View style={[styles.posterFill, styles.posterPlaceholder]}>
                        <View style={styles.placeholderOrb} />
                        <Text style={styles.placeholderLabel}>{title}</Text>
                        {unavailableHint ? <Text style={styles.placeholderHint}>{unavailableHint}</Text> : null}
                    </View>
                ) : (
                    <Image style={styles.poster} source={{ uri: posterUri }} resizeMode="cover" />
                )}

                <PosterScrim />
                <View style={styles.decorOrb} />

                {!unavailable && rating != null ? (
                    <View style={[styles.ratingPill, { borderColor: `${ratingTint}55` }]}>
                        <View style={[styles.ratingDot, { backgroundColor: ratingTint }]} />
                        <Text style={styles.ratingValue}>{ratingLabel}</Text>
                        <Text style={styles.ratingCaption}>KP</Text>
                    </View>
                ) : null}

                <View style={styles.posterTitleBlock}>
                    <Text style={styles.title} numberOfLines={isExpanded ? 1 : 2}>
                        {title}
                    </Text>
                    {yearSuffix ? <Text style={styles.year}>{yearSuffix}</Text> : null}
                </View>
            </Animated.View>

            <View style={styles.body}>
                {chips ? <View style={styles.chipsRow}>{chips}</View> : null}

                {description ? (
                    <View style={styles.descriptionBlock} onLayout={handleDescriptionBlockLayout}>
                        <Text
                            accessible={false}
                            importantForAccessibility="no"
                            pointerEvents="none"
                            style={[styles.description, styles.descriptionMeasure]}
                            onTextLayout={handleDescriptionTextLayout}
                        >
                            {description}
                        </Text>
                        <Animated.View style={[styles.descriptionClip, descriptionClipStyle]}>
                            <ScrollView
                                ref={descriptionScrollRef}
                                style={styles.descriptionScroll}
                                contentContainerStyle={styles.descriptionScrollContent}
                                nestedScrollEnabled
                                scrollEnabled={isExpanded}
                                showsVerticalScrollIndicator={isExpanded}
                                bounces={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <Text style={styles.description}>{description}</Text>
                            </ScrollView>
                        </Animated.View>
                        <View style={styles.descriptionSpacer} />
                        <TouchableOpacity
                            style={styles.expandPill}
                            onPress={onToggleExpand}
                            onLayout={handleExpandButtonLayout}
                            activeOpacity={0.75}
                            accessibilityRole="button"
                        >
                            <Text style={styles.expandPillText}>{isExpanded ? collapseLabel : expandLabel}</Text>
                        </TouchableOpacity>
                    </View>
                ) : unavailableHint ? (
                    <Text style={styles.descriptionMuted}>{unavailableHint}</Text>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        maxHeight: '100%',
        alignSelf: 'center',
        borderRadius: 28,
        backgroundColor: '#141418',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.42,
                shadowRadius: 28,
            },
            android: {
                elevation: 18,
            },
        }),
    },
    accentBarWrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 4,
    },
    accentBar: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },
    posterFrame: {
        width: '100%',
        overflow: 'hidden',
        backgroundColor: Color.NEW_BLACK,
    },
    poster: {
        width: '100%',
        height: POSTER_HEIGHT_COLLAPSED,
    },
    posterFill: {
        ...StyleSheet.absoluteFillObject,
    },
    posterScrim: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    posterPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#1A1A22',
    },
    placeholderOrb: {
        position: 'absolute',
        top: 40,
        right: -20,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(132, 94, 247, 0.22)',
    },
    placeholderLabel: {
        color: Color.WHITE,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    placeholderHint: {
        marginTop: 10,
        color: Color.FADED_WHITE,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
    decorOrb: {
        position: 'absolute',
        top: 24,
        left: -36,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 107, 107, 0.14)',
    },
    ratingPill: {
        position: 'absolute',
        top: 18,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: 'rgba(10, 10, 12, 0.55)',
        borderWidth: 1,
    },
    ratingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    ratingValue: {
        color: Color.WHITE,
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: -0.2,
        marginRight: 4,
    },
    ratingCaption: {
        color: Color.FADED_WHITE,
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    posterTitleBlock: {
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 18,
    },
    title: {
        color: Color.WHITE,
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
        lineHeight: 28,
    },
    year: {
        marginTop: 4,
        color: 'rgba(250, 250, 250, 0.65)',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.4,
    },
    body: {
        flex: 1,
        minHeight: 0,
        paddingHorizontal: 18,
        paddingTop: 12,
        paddingBottom: 14,
        backgroundColor: '#141418',
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 8,
        flexShrink: 0,
    },
    descriptionBlock: {
        flex: 1,
        minHeight: 0,
    },
    descriptionMeasure: {
        position: 'absolute',
        opacity: 0,
        left: 0,
        right: 0,
        top: 0,
    },
    descriptionClip: {
        overflow: 'hidden',
        marginBottom: DESCRIPTION_BUTTON_GAP,
    },
    descriptionSpacer: {
        flex: 1,
        minHeight: 0,
    },
    descriptionScroll: {
        flex: 1,
    },
    descriptionScrollContent: {
        paddingBottom: 4,
    },
    description: {
        color: 'rgba(250, 250, 250, 0.88)',
        fontSize: 15,
        lineHeight: 22,
        letterSpacing: 0.1,
    },
    descriptionMuted: {
        color: Color.FADED_WHITE,
        fontSize: 15,
        lineHeight: 22,
    },
    expandPill: {
        alignSelf: 'flex-start',
        flexShrink: 0,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    expandPillText: {
        color: Color.FADED_WHITE,
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});
