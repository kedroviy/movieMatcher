import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SMMovieChips } from 'pages/Main/ui/sm-movie-chips';
import { SwipeMovieCard } from 'pages/Main/ui/swipe-movie-card';
import { Color } from 'styles/colors';

type SMSwipeCardType = {
    card: any;
};

const glassChip = { color: Color.LIGHT_RED, labelColor: Color.WHITE, variant: 'glass' as const };

export const MatchSwipeCards: FC<SMSwipeCardType> = ({ card }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    if (!card || typeof card !== 'object') {
        return (
            <SwipeMovieCard
                unavailable
                title={t('match_movie.swipe.unavailable_title')}
                unavailableHint={t('match_movie.swipe.unavailable_description')}
                isExpanded={false}
                onToggleExpand={() => undefined}
                expandLabel={t('general.expand')}
                collapseLabel={t('general.collapse')}
            />
        );
    }

    const chips = (
        <>
            {card?.ageRating != null && Number(card.ageRating) > 0 ? (
                <SMMovieChips label={card.ageRating} type="age" {...glassChip} />
            ) : null}
            {card?.movieLength != null && Number(card.movieLength) > 0 ? (
                <SMMovieChips label={card.movieLength} type="time" {...glassChip} />
            ) : null}
            {card?.countries?.[0]?.name ? (
                <SMMovieChips label={card.countries[0].name} {...glassChip} />
            ) : null}
            {card?.genres?.[0]?.name ? <SMMovieChips label={card.genres[0].name} {...glassChip} /> : null}
            {card?.releaseYears?.[0] ? (
                <SMMovieChips
                    label={`${card.releaseYears[0].start}-${card.releaseYears[0].end}`}
                    {...glassChip}
                />
            ) : null}
        </>
    );

    return (
        <SwipeMovieCard
            posterUri={card?.poster?.previewUrl}
            rating={card?.rating?.kp}
            title={card?.name ?? '—'}
            year={card?.year}
            description={card?.description}
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded((prev) => !prev)}
            expandLabel={t('general.expand')}
            collapseLabel={t('general.collapse')}
            chips={chips}
        />
    );
};
