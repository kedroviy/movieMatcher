import { useEffect, useState } from 'react';

export const useIsLastCard = (currentIndex: number, totalCards: number) => {
    const [isLastCard, setIsLastCard] = useState(false);

    useEffect(() => {
        if (currentIndex === totalCards) {
            setIsLastCard(true);
        } else {
            setIsLastCard(false);
        }
    }, [currentIndex, totalCards]);

    return isLastCard;
};
