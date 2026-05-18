export type FeedbackMessageStatus = 'NEW' | 'IN_PROGRESS' | 'ANSWERED';

export type FeedbackMessage = {
    id: number;
    email: string;
    text: string;
    status: FeedbackMessageStatus;
    adminReply: string | null;
    adminRepliedAt: string | null;
    createdAt: string;
    updatedAt: string;
};
