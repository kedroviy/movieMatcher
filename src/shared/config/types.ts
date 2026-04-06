export type NotificationType = 'success' | 'error' | 'warning';

export type SnackBarNotification = {
    id: number;
    message: string;
    type: NotificationType;
};