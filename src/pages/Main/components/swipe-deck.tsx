import { ComponentProps, ReactElement, RefObject, useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';

import { Color } from 'styles/colors';
import { CARD_HEIGHT, CARD_WIDTH } from '../ui/swipe-movie-card';

type OverlayLabels = ComponentProps<typeof Swiper>['overlayLabels'];

type SwipeDeckLayout = {
    width: number;
    height: number;
};

type SwipeDeckProps<T> = {
    deckKey: string;
    cards: T[];
    renderCard: (card: T) => ReactElement;
    overlayLabels: OverlayLabels;
    swiperRef: RefObject<Swiper<T> | null>;
    onSwiped: (cardIndex: number) => void;
    onSwipedRight?: (cardIndex: number, card: T) => void;
    onSwipedLeft?: (cardIndex: number) => void;
};

/**
 * `react-native-deck-swiper` needs a real pixel box. A parent with `alignItems: 'center'`
 * collapses `width: '100%'` to 0, so waiting on onLayout never mounts the cards
 * (empty match screen with like/dislike buttons still visible).
 */
export function SwipeDeck<T>({
    deckKey,
    cards,
    renderCard,
    overlayLabels,
    swiperRef,
    onSwiped,
    onSwipedRight,
    onSwipedLeft,
}: SwipeDeckProps<T>) {
    const window = useWindowDimensions();
    const [measured, setMeasured] = useState<SwipeDeckLayout | null>(null);
    const handleLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        if (width < 2 || height < 2) {
            return;
        }
        setMeasured((current) =>
            current?.width === width && current?.height === height ? current : { width, height },
        );
    }, []);
    const width = measured?.width ?? window.width;
    const height = measured?.height ?? Math.max(window.height - 240, CARD_HEIGHT);
    const cardHeight = Math.min(CARD_HEIGHT, Math.max(height - 16, 200));
    if (!cards.length) {
        return <View style={styles.clip} onLayout={handleLayout} />;
    }
    return (
        <View style={styles.clip} onLayout={handleLayout}>
            <Swiper
                key={deckKey}
                ref={swiperRef}
                animateCardOpacity
                cards={cards}
                cardIndex={0}
                renderCard={(card) => renderCard(card)}
                containerStyle={{
                    width,
                    height,
                    backgroundColor: Color.BACKGROUND_GREY,
                }}
                cardStyle={{
                    width: CARD_WIDTH,
                    height: cardHeight,
                }}
                backgroundColor="transparent"
                stackSize={Math.min(2, cards.length)}
                stackSeparation={-20}
                horizontalSwipe
                verticalSwipe={false}
                showSecondCard={cards.length > 1}
                animateOverlayLabelsOpacity
                onSwipedLeft={onSwipedLeft}
                onSwipedRight={
                    onSwipedRight
                        ? (cardIndex: number) => onSwipedRight(cardIndex, cards[cardIndex])
                        : undefined
                }
                onSwiped={onSwiped}
                overlayLabels={overlayLabels}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    clip: {
        alignSelf: 'stretch',
        width: '100%',
        flex: 1,
        minHeight: 280,
        overflow: 'visible',
    },
});
