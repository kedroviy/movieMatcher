import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import useFetchUserProfile from 'shared/hooks/getUserProfile';

export const useLocalizedMenuItems = () => {
    const { t } = useTranslation();
    const { user, loading: userLoading, error: userError } = useFetchUserProfile();

    const menuItems = React.useMemo(() => [
        {
            id: 0,
            iconComponent:
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <Path id="Vector" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <Path id="Vector_2" d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </Svg>,
            name: t('profile.account_settings'),
            navigateScreen: 'UPAccountSettings',
        },
        {
            id: 1,
            iconComponent:
                <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <Path d="M13.9999 8.52667C13.8951 9.66147 13.4692 10.7429 12.7721 11.6445C12.075 12.5461 11.1356 13.2305 10.0637 13.6177C8.99188 14.0049 7.83192 14.0787 6.7196 13.8307C5.60728 13.5827 4.5886 13.023 3.78275 12.2172C2.97691 11.4113 2.41723 10.3927 2.16921 9.28033C1.92118 8.16801 1.99508 7.00806 2.38224 5.9362C2.7694 4.86434 3.45382 3.92491 4.35541 3.22784C5.257 2.53076 6.33847 2.10487 7.47327 2C6.80888 2.89884 6.48917 4.0063 6.57229 5.12094C6.65541 6.23559 7.13584 7.28337 7.9262 8.07373C8.71656 8.86409 9.76435 9.34452 10.879 9.42765C11.9936 9.51077 13.1011 9.19106 13.9999 8.52667Z" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                </Svg>,
            name: t('profile.theme'),
            navigateScreen: 'UPAboutApplication',
        },
        {
            id: 2,
            iconComponent:
                <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <G clip-path="url(#clip0_1064_7395)">
                        <Path d="M7.99967 14.6663C11.6816 14.6663 14.6663 11.6816 14.6663 7.99967C14.6663 4.31778 11.6816 1.33301 7.99967 1.33301C4.31778 1.33301 1.33301 4.31778 1.33301 7.99967C1.33301 11.6816 4.31778 14.6663 7.99967 14.6663Z" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                        <Path d="M1.33301 8H14.6663" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                        <Path d="M7.99967 1.33301C9.66719 3.15858 10.6148 5.5277 10.6663 7.99967C10.6148 10.4717 9.66719 12.8408 7.99967 14.6663C6.33215 12.8408 5.38451 10.4717 5.33301 7.99967C5.38451 5.5277 6.33215 3.15858 7.99967 1.33301Z" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                    </G>
                    <Defs>
                        <ClipPath id="clip0_1064_7395">
                            <Rect width="16" height="16" fill="white" />
                        </ClipPath>
                    </Defs>
                </Svg>,
            name: t('profile.language'),
            navigateScreen: 'UPLanguage',
        },
        {
            id: 3,
            iconComponent:
                <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <G clip-path="url(#clip0_1104_7312)">
                        <Path d="M7.99967 14.6663C11.6816 14.6663 14.6663 11.6816 14.6663 7.99967C14.6663 4.31778 11.6816 1.33301 7.99967 1.33301C4.31778 1.33301 1.33301 4.31778 1.33301 7.99967C1.33301 11.6816 4.31778 14.6663 7.99967 14.6663Z" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                        <Path d="M8 5.33301V7.99967" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                        <Path d="M8 10.667H8.00667" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                    </G>
                    <Defs>
                        <ClipPath id="clip0_1104_7312">
                            <Rect width="16" height="16" fill="white" />
                        </ClipPath>
                    </Defs>
                </Svg>,
            name: t('profile.about_application'),
            navigateScreen: 'UPAboutApplication',
        }
    ], [t]);

    const aboutAppItems = React.useMemo(() => [
        {
            id: 0,
            iconComponent:
                <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <Path d="M14 10C14 10.3536 13.8595 10.6928 13.6095 10.9428C13.3594 11.1929 13.0203 11.3333 12.6667 11.3333H4.66667L2 14V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V10Z" stroke="#F9F9F9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </Svg>,
            name: t('about_app.feedback'),
        },
        {
            id: 1,
            iconComponent:
                <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <G clip-path="url(#clip0_1431_1972)">
                        <Path d="M4.66634 7.33301L7.33301 1.33301C7.86344 1.33301 8.37215 1.54372 8.74722 1.91879C9.12229 2.29387 9.33301 2.80257 9.33301 3.33301V5.99967H13.1063C13.2996 5.99749 13.4911 6.03734 13.6674 6.11649C13.8437 6.19563 14.0008 6.31216 14.1276 6.45802C14.2544 6.60387 14.348 6.77556 14.4019 6.96118C14.4558 7.1468 14.4687 7.34191 14.4397 7.53301L13.5197 13.533C13.4715 13.8509 13.31 14.1407 13.0649 14.349C12.8199 14.5573 12.5079 14.67 12.1863 14.6663H4.66634M4.66634 7.33301V14.6663M4.66634 7.33301H2.66634C2.31272 7.33301 1.97358 7.47348 1.72353 7.72353C1.47348 7.97358 1.33301 8.31272 1.33301 8.66634V13.333C1.33301 13.6866 1.47348 14.0258 1.72353 14.2758C1.97358 14.5259 2.31272 14.6663 2.66634 14.6663H4.66634" stroke="#F9F9F9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </G>
                    <Defs>
                        <ClipPath id="clip0_1431_1972">
                            <Rect width="16" height="16" fill="white" />
                        </ClipPath>
                    </Defs>
                </Svg>,
            name: t('about_app.rate_app'),
        }
    ], [t]);

    const accountSettingsItems = React.useMemo(() => [
        {
            id: 1,
            name: t('acc_settings.user_name'),
            subName: user?.username ?? 'User',
            navigateScreen: 'UPChangeName',
        },
        {
            id: 2,
            name: t('acc_settings.email'),
            subName: user?.email ?? 'Email',
        },
        {
            id: 3,
            name: t('acc_settings.password'),
        }
    ], [t]);

    return { menuItems, aboutAppItems, accountSettingsItems };
};
