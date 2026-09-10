import React, { FC, ReactNode, useEffect, useMemo, useRef } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Color } from 'styles/colors';
import { getRatingColor, roundDownToOneTenth } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = SCREEN_WIDTH - 28;
export const CARD_HEIGHT = 560;
const POSTER_HEIGHT_COLLAPSED = 340;
const POSTER_HEIGHT_EXPANDED = 272;

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

const PosterScrim: FC<{ height: number }> = ({ height }) => (
    <Svg width={CARD_WIDTH} height={height} style={styles.posterScrim}>
        <Defs>
            <LinearGradient id="posterFade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#0A0A0C" stopOpacity="0" />
                <Stop offset="0.55" stopColor="#0A0A0C" stopOpacity="0.15" />
                <Stop offset="1" stopColor="#0A0A0C" stopOpacity="0.92" />
            </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={CARD_WIDTH} height={height} fill="url(#posterFade)" />
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
    const posterHeight = isExpanded ? POSTER_HEIGHT_EXPANDED : POSTER_HEIGHT_COLLAPSED;
    const yearSuffix = year != null && String(year).length > 0 ? String(year) : null;
    const descriptionScrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (!isExpanded) {
            descriptionScrollRef.current?.scrollTo({ y: 0, animated: false });
        }
    }, [isExpanded]);

    return (
        <View style={[styles.card, style]}>
            <View style={styles.accentBarWrap}>
                <AccentBar />
            </View>

            <View style={[styles.posterFrame, { height: posterHeight }]}>
                {unavailable || !posterUri ? (
                    <View style={[styles.poster, styles.posterPlaceholder, { height: posterHeight }]}>
                        <View style={styles.placeholderOrb} />
                        <Text style={styles.placeholderLabel}>{title}</Text>
                        {unavailableHint ? (
                            <Text style={styles.placeholderHint}>{unavailableHint}</Text>
                        ) : null}
                    </View>
                ) : (
                    <Image
                        style={[styles.poster, { height: posterHeight }]}
                        source={{ uri: posterUri }}
                        resizeMode="cover"
                    />
                )}

                <PosterScrim height={posterHeight} />
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
            </View>

            <View style={styles.body}>
                {chips ? <View style={styles.chipsRow}>{chips}</View> : null}

                {description ? (
                    <View style={styles.descriptionBlock}>
                        <View style={styles.descriptionContent}>
                            {isExpanded ? (
                                <ScrollView
                                    ref={descriptionScrollRef}
                                    style={styles.descriptionScroll}
                                    contentContainerStyle={styles.descriptionScrollContent}
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator
                                    bounces={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <Text style={styles.description}>{description}</Text>
                                </ScrollView>
                            ) : (
                                <Text
                                    style={styles.description}
                                    numberOfLines={4}
                                    ellipsizeMode="tail"
                                >
                                    {description}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.expandPill}
                            onPress={onToggleExpand}
                            activeOpacity={0.75}
                            accessibilityRole="button"
                        >
                            <Text style={styles.expandPillText}>
                                {isExpanded ? collapseLabel : expandLabel}
                            </Text>
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
        marginBottom: 24,
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
        backgroundColor: Color.NEW_BLACK,
    },
    poster: {
        width: '100%',
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
    descriptionContent: {
        flex: 1,
        minHeight: 0,
        marginBottom: 10,
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
