import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SMMovieChips } from 'pages/Main/ui/sm-movie-chips';
import { SwipeMovieCard } from 'pages/Main/ui/swipe-movie-card';
import { resolveMoviePosterUri, resolveMovieTitle } from 'pages/Main/utils/movie-card-media';
import { Color } from 'styles/colors';

type SMSwipeCardType = {
    card: unknown;
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

    const movie = card as {
        ageRating?: unknown;
        movieLength?: unknown;
        countries?: Array<{ name?: string }>;
        genres?: Array<{ name?: string }>;
        releaseYears?: Array<{ start?: unknown; end?: unknown }>;
        poster?: unknown;
        rating?: { kp?: number };
        year?: string | number | null;
        description?: string | null;
    };

    const chips = (
        <>
            {movie.ageRating != null && Number(movie.ageRating) > 0 ? (
                <SMMovieChips label={Number(movie.ageRating)} type="age" {...glassChip} />
            ) : null}
            {movie.movieLength != null && Number(movie.movieLength) > 0 ? (
                <SMMovieChips label={Number(movie.movieLength)} type="time" {...glassChip} />
            ) : null}
            {movie.countries?.[0]?.name ? (
                <SMMovieChips label={movie.countries[0].name} {...glassChip} />
            ) : null}
            {movie.genres?.[0]?.name ? <SMMovieChips label={movie.genres[0].name} {...glassChip} /> : null}
            {movie.releaseYears?.[0] ? (
                <SMMovieChips
                    label={`${movie.releaseYears[0].start}-${movie.releaseYears[0].end}`}
                    {...glassChip}
                />
            ) : null}
        </>
    );

    return (
        <SwipeMovieCard
            posterUri={resolveMoviePosterUri(movie.poster)}
            rating={movie.rating?.kp}
            title={resolveMovieTitle(card)}
            year={movie.year}
            description={movie.description}
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded((prev) => !prev)}
            expandLabel={t('general.expand')}
            collapseLabel={t('general.collapse')}
            chips={chips}
        />
    );
};
