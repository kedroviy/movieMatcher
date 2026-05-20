import { useCallback, useState } from 'react';

/** Shows onboarding on each lobby screen mount; call `dismiss` to hide until unmount. */
export const useLobbyOnboarding = () => {
    const [visible, setVisible] = useState(true);

    const dismiss = useCallback(() => {
        setVisible(false);
    }, []);

    return {
        visible,
        dismiss,
    };
};
