import { Dimensions, Platform } from 'react-native';

/** 8px grid — отступы и ритм */
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
} as const;

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 9999,
} as const;

/** Горизонтальные поля экрана (раньше везде было width − 32) */
export const screenPadding = spacing.md;

const windowWidth = Dimensions.get('window').width;

export const contentWidth = windowWidth - screenPadding * 2;

/** Тонкая граница между слоями на тёмном фоне */
export const borderSubtle = 'rgba(255, 255, 255, 0.08)';

/** Карточка / плашка: лёгкая глубина */
export const shadowCard = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 14,
    },
    android: {
        elevation: 6,
    },
    default: {},
});
