import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { TimedModal } from 'shared';

import { LOBBY_ONBOARDING_AUTO_DISMISS_MS } from '../constants';

type LobbyOnboardingModalProps = {
    visible: boolean;
    onClose: () => void;
};

export const LobbyOnboardingModal: FC<LobbyOnboardingModalProps> = ({ visible, onClose }) => {
    const { t } = useTranslation();

    return (
        <TimedModal
            visible={visible}
            onClose={onClose}
            title={t('match_movie.lobby.onboarding.title')}
            description={t('match_movie.lobby.onboarding.description')}
            closeLabel={t('match_movie.lobby.onboarding.close')}
            autoDismissMs={LOBBY_ONBOARDING_AUTO_DISMISS_MS}
        />
    );
};
